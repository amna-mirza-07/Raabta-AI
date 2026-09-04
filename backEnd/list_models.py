import os
import sys
import traceback
from dotenv import load_dotenv

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_env = os.path.join(current_dir, ".env")
root_env = os.path.join(current_dir, "..", ".env")
legacy_env = os.path.join(current_dir, "config.env")

if os.path.exists(backend_env):
    load_dotenv(backend_env)
elif os.path.exists(root_env):
    load_dotenv(root_env)
elif os.path.exists(legacy_env):
    load_dotenv(legacy_env)
else:
    load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

print("=" * 40)
print("Google GenAI Model Listing")
print("=" * 40)
print("API KEY DETECTED:", bool(api_key))

if not api_key:
    print("[ERROR] GOOGLE_API_KEY is not set. Please set GOOGLE_API_KEY in backEnd/.env")
    sys.exit(1)

try:
    from google import genai
    client = genai.Client(api_key=api_key)
    print("\nAVAILABLE MODELS:\n")
    for model in client.models.list():
        # Only show relevant model display name / id
        model_id = getattr(model, "name", str(model))
        print(f" - {model_id}")
except Exception as e:
    print("\n[ERROR listing models]")
    print(f"{type(e).__name__}: {str(e)}")