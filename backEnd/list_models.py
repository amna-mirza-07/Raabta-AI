import os
import traceback
from dotenv import load_dotenv
from google import genai

load_dotenv("config.env")

api_key = os.getenv("GOOGLE_API_KEY")

print("SDK Loaded")
print("API KEY EXISTS:", bool(api_key))

client = genai.Client(api_key=api_key)

print("\nAVAILABLE MODELS:\n")

try:
    for model in client.models.list():
        print(model.name)

except Exception as e:
    print("\nERROR")
    print(e)
    traceback.print_exc()