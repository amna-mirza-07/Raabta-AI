from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename

from services.voice_input import speech_to_text
from services.voice_output import text_to_speech
from services.gemma_service import (
    detect_issue_from_text,
    generate_complaint
)

voice_report_bp = Blueprint(
    "voice_report",
    __name__
)

UPLOAD_FOLDER = os.path.join("/tmp", "uploads") if os.environ.get("VERCEL") else "uploads"


@voice_report_bp.route("/voice-report", methods=["POST"], strict_slashes=False)
def voice_report():

    audio_path = None

    try:

        # --------------------------------
        # STEP 1 : Receive Audio
        # --------------------------------
        if "audio" not in request.files:
            return jsonify({
                "success": False,
                "error": "Audio file missing."
            }), 400

        audio = request.files["audio"]

        if audio.filename == "":
            return jsonify({
                "success": False,
                "error": "No audio file selected."
            }), 400

        os.makedirs(
            UPLOAD_FOLDER,
            exist_ok=True
        )

        audio_path = os.path.join(
            UPLOAD_FOLDER,
            secure_filename(audio.filename)
        )

        audio.save(audio_path)

        print("\n========== AUDIO RECEIVED ==========")
        print(audio_path)
        print("====================================\n")

        # --------------------------------
        # STEP 2 : Speech To Text
        # --------------------------------
        try:
            voice_result = speech_to_text(audio_path)
            user_text = voice_result.get("text", "").strip()
        except Exception as stt_err:
            print(f"[ERROR] Audio transcription failed: {stt_err}")
            return jsonify({
                "success": False,
                "error": f"Audio processing error: {str(stt_err)}"
            }), 400

        try:
            print("\n========== TRANSCRIPTION ==========")
            print(user_text)
            print("===================================\n")
        except Exception:
            pass

        if not user_text:
            return jsonify({
                "success": False,
                "error": "Speech could not be recognized."
            }), 400

        # --------------------------------
        # STEP 3 : Detect Issue
        # --------------------------------
        issue_data = detect_issue_from_text(user_text)

        try:
            print("\n========== ISSUE DATA ==========")
            print(issue_data)
            print("================================\n")
        except Exception:
            pass

        issue = issue_data.get(
            "issue",
            "General Civic Issue"
        )

        reason = issue_data.get(
            "reason",
            user_text
        )

        severity = issue_data.get(
            "severity",
            "Medium"
        )

        department = issue_data.get(
            "department",
            "Municipal Corporation"
        )

        # --------------------------------
        # STEP 4 : Generate Complaint
        # --------------------------------
        complaint = generate_complaint(
            issue=issue,
            reason=reason,
            severity=severity,
            department=department
        )

        if not isinstance(complaint, dict):
            complaint = {
                "complaint_subject": f"Complaint Regarding {issue}",
                "complaint_body": str(complaint)
            }

        print("\n========== COMPLAINT ==========")
        print(complaint)
        print("================================\n")

        # --------------------------------
        # STEP 5 : Generate Voice Response
        # --------------------------------
        voice_message = (
            f"Your complaint has been generated successfully. "
            f"The detected issue is {issue}. "
            f"It will be forwarded to {department}. "
            f"Thank you for using Raabta AI."
        )

        audio_file = None
        try:
            audio_file = text_to_speech(voice_message)
            print("\n========== TTS GENERATED ==========")
            print(audio_file)
            print("===================================\n")
        except Exception as tts_err:
            print(f"[WARN] TTS generation failed: {tts_err}")

        # --------------------------------
        # FINAL RESPONSE
        # --------------------------------
        return jsonify({

            "success": True,

            "transcription": user_text,

            "issue": issue_data,

            "department": department,

            "complaint": complaint,

            "voice_text": voice_message,

            "voice_file": audio_file

        }), 200

    except Exception as e:

        print("\n========== VOICE ROUTE ERROR ==========")
        print(e)
        print("=======================================\n")

        err_msg = str(e)
        if "AIza" in err_msg:
            err_msg = "Error connecting to AI service."

        return jsonify({

            "success": False,

            "error": err_msg

        }), 500

    finally:
        # Optional: uploaded audio delete kar do
        try:
            if audio_path and os.path.exists(audio_path):
                os.remove(audio_path)
        except Exception:
            pass