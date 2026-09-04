import os
import sys

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from dotenv import load_dotenv

# Search and load .env
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
model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

print("=" * 40)
print("Gemini configuration:")
print("=" * 40)

if not api_key:
    print("API key detected: NO")
    print("Client initialized: NO")
    print(f"Model configured: {model_name}")
    print("Test generation: FAIL")
    print("\n[DIAGNOSIS: KEY_MISSING]")
    print("GOOGLE_API_KEY was not found in environment or .env file.")
    print("Please configure GOOGLE_API_KEY in backEnd/.env or project root .env.")
    print("=" * 40)
    sys.exit(1)

print("API key detected: YES")

# Test client initialization
client = None
try:
    from google import genai
    client = genai.Client(api_key=api_key)
    print("Client initialized: YES")
except Exception as e:
    print("Client initialized: NO")
    print(f"Model configured: {model_name}")
    print("Test generation: FAIL")
    print("\n[DIAGNOSIS: CLIENT_INIT_FAILURE]")
    print(f"Failed to initialize Google GenAI client: {type(e).__name__}: {str(e)}")
    print("=" * 40)
    sys.exit(1)

print(f"Model configured: {model_name}")

# Test real generation
try:
    response = client.models.generate_content(
        model=model_name,
        contents="Say 'Raabta AI Gemini Connection Test: SUCCESS'."
    )
    
    # Verify response
    response_text = ""
    if hasattr(response, "text") and response.text:
        response_text = response.text.strip()
    elif hasattr(response, "candidates") and response.candidates:
        for c in response.candidates:
            if c.content and c.content.parts:
                response_text += "".join(p.text for p in c.content.parts if hasattr(p, "text") and p.text)
    
    if response_text:
        print("Test generation: SUCCESS")
        print(f"\n[OK] Model response snippet: {response_text[:80]}...")
        print("=" * 40)
        sys.exit(0)
    else:
        print("Test generation: FAIL")
        print("\n[DIAGNOSIS: EMPTY_RESPONSE]")
        print("Gemini model returned an empty response.")
        print("=" * 40)
        sys.exit(1)

except Exception as e:
    err_str = str(e)
    err_lower = err_str.lower()
    
    print("Test generation: FAIL")
    print("\n[DIAGNOSIS RESULT]")
    
    if "api_key_invalid" in err_lower or "api key not valid" in err_lower or "401" in err_str or "403" in err_str:
        print("Category: INVALID_API_KEY")
        print("The provided GOOGLE_API_KEY is invalid or lacks necessary permissions.")
    elif "404" in err_str or "not found" in err_lower or "unsupported" in err_lower:
        print("Category: MODEL_UNAVAILABLE")
        print(f"Model '{model_name}' is not found or not available for this API key.")
    elif "429" in err_str or "resource_exhausted" in err_lower or "quota" in err_lower:
        print("Category: QUOTA_EXCEEDED")
        print("API quota limit reached for this key or project.")
    elif "connection" in err_lower or "timeout" in err_lower or "resolve" in err_lower or "network" in err_lower:
        print("Category: NETWORK_ERROR")
        print(f"Network connectivity problem while reaching Gemini API: {type(e).__name__}")
    else:
        print("Category: API_ERROR")
        print(f"Error: {type(e).__name__}: {err_str}")
        
    print("=" * 40)
    sys.exit(1)
