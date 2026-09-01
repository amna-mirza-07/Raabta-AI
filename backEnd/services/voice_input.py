from faster_whisper import WhisperModel

_model = None

def get_whisper_model():
    global _model
    if _model is None:
        print("Loading Whisper model...")
        _model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
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

    print("Detected Language :", info.language)
    print("Transcription     :", text)
    print("====================================\n")

    return {
        "language": info.language,
        "text": text
    }