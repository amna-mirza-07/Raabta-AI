import os
import sys
import json
import urllib.request
import urllib.error
from PIL import Image

BASE_URL = "http://127.0.0.1:5000/api"

def test_health():
    print("\n--- Testing GET /api/health ---")
    req = urllib.request.Request(f"{BASE_URL}/health")
    try:
        with urllib.request.urlopen(req) as res:
            print("Status:", res.status)
            data = json.loads(res.read().decode())
            print("Response:", json.dumps(data, indent=2))
            assert data["status"] == "healthy"
            print(">>> HEALTH TEST: PASS")
    except Exception as e:
        print("Health test failed:", e)

def test_text_report():
    print("\n--- Testing POST /api/text-report ---")
    payload = json.dumps({"text": "There is a large pothole on our street."}).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/text-report",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as res:
            print("Status:", res.status)
            data = json.loads(res.read().decode())
            print("Response:", json.dumps(data, indent=2))
            print(">>> TEXT REPORT TEST: PASS (Gemini succeeded)")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print("HTTP Status:", e.code)
        print("Body:", body)
        if "GOOGLE_API_KEY" in body:
            print(">>> TEXT REPORT TEST: REACHED BACKEND & SAFELY IDENTIFIED MISSING/CONFIGURED KEY")
        else:
            print(">>> TEXT REPORT TEST: FAILED")

def test_image_report():
    print("\n--- Testing POST /api/report ---")
    test_img = "test_civic_sample.jpg"
    Image.new("RGB", (256, 256), color=(120, 120, 120)).save(test_img)

    try:
        boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
        with open(test_img, "rb") as f:
            img_bytes = f.read()

        parts = [
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"test_civic_sample.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n".encode("utf-8"),
            img_bytes,
            f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"location\"\r\n\r\nLahore, Pakistan\r\n".encode("utf-8"),
            f"--{boundary}--\r\n".encode("utf-8")
        ]
        body = b"".join(parts)

        req = urllib.request.Request(
            f"{BASE_URL}/report",
            data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
        )

        try:
            with urllib.request.urlopen(req) as res:
                print("Status:", res.status)
                data = json.loads(res.read().decode())
                print("Response:", json.dumps(data, indent=2))
                print(">>> IMAGE REPORT TEST: PASS")
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print("HTTP Status:", e.code)
            print("Body:", body)
            if "GOOGLE_API_KEY" in body:
                print(">>> IMAGE REPORT TEST: REACHED BACKEND & SAFELY IDENTIFIED MISSING/CONFIGURED KEY")
    finally:
        if os.path.exists(test_img):
            os.remove(test_img)

def test_image_report_corrupt():
    print("\n--- Testing POST /api/report (Corrupted Image) ---")
    boundary = "----WebKitFormBoundaryCorruptImgTest"
    parts = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"corrupt.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n".encode("utf-8"),
        b"this is corrupt non-image binary data",
        f"\r\n--{boundary}--\r\n".encode("utf-8")
    ]
    body = b"".join(parts)
    req = urllib.request.Request(
        f"{BASE_URL}/report",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    try:
        with urllib.request.urlopen(req) as res:
            print("Status:", res.status)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print("HTTP Status:", e.code)
        print("Body:", body)
        assert e.code == 400
        print(">>> CORRUPT IMAGE TEST: PASS (Server returned clean HTTP 400 without crashing)")

def test_voice_report_invalid_audio():
    print("\n--- Testing POST /api/voice-report (Corrupted / Empty audio) ---")
    boundary = "----WebKitFormBoundaryVoiceTest123"
    parts = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"audio\"; filename=\"corrupted.wav\"\r\nContent-Type: audio/wav\r\n\r\n".encode("utf-8"),
        b"not a valid audio file",
        f"\r\n--{boundary}--\r\n".encode("utf-8")
    ]
    body = b"".join(parts)
    req = urllib.request.Request(
        f"{BASE_URL}/voice-report",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    try:
        with urllib.request.urlopen(req) as res:
            print("Status:", res.status)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print("HTTP Status:", e.code)
        print("Body:", body)
        data = json.loads(body)
        assert data.get("success") is False
        print(">>> VOICE ERROR ISOLATION TEST: PASS (Server returned clean JSON error without crashing)")

if __name__ == "__main__":
    test_health()
    test_text_report()
    test_image_report()
    test_image_report_corrupt()
    test_voice_report_invalid_audio()
