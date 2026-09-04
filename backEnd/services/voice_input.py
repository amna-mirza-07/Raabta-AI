import os
from faster_whisper import WhisperModel

_model = None

def get_whisper_model():
    global _model
    if _model is None:
        print("Loading Whisper model...")
        download_root = os.path.join("/tmp", "whisper") if os.environ.get("VERCEL") else None
        _model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8",
            download_root=download_root
        )
        print("Whisper model loaded.")
    return _model


def speech_to_text(audio_path):

    print("\n========== SPEECH TO TEXT ==========")

    model = get_whisper_model()

    segments, info = model.transcribe(
        audio_path,
        language="ur",      # Force Urdu
        beam_size=5
    )

    text = ""

    for segment in segments:
        text += segment.text + " "

    text = text.strip()

    print("Detected Language :", getattr(info, "language", "unknown"))
    try:
        print("Transcription     :", text)
    except Exception:
        print("Transcription (bytes):", text.encode("utf-8", errors="replace"))
    print("====================================\n")

    return {
        "language": getattr(info, "language", "ur"),
        "text": text
    }