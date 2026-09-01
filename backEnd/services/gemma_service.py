import os
import io
import json
import time
import traceback

from dotenv import load_dotenv
from PIL import Image

from google import genai
from google.genai import types


# =============================
# GEMMA MODEL
# =============================

MODEL_NAME = "gemma-4-31b-it"


# =============================
# CLIENT SETUP
# =============================

def get_genai_client():

    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:

        current_dir = os.path.dirname(
            os.path.abspath(__file__)
        )

        config_path = os.path.join(
            current_dir,
            "..",
            "config.env"
        )

        load_dotenv(config_path)

        api_key = os.getenv(
            "GOOGLE_API_KEY"
        )


    print(
        "API KEY EXISTS:",
        bool(api_key)
    )


    if not api_key:
        raise Exception(
            "GOOGLE_API_KEY not found"
        )


    return genai.Client(
        api_key=api_key
    )



# =============================
# VISION PROMPT
# =============================

STEP1_PROMPT = """

You are Raabta AI.

Analyze this civic issue image from Pakistan.

Return ONLY JSON.

Format:

{
 "issue":"",
 "reason":"",
 "severity":"",
 "department":""
}


Possible issues:

- Pothole
- Broken Traffic Light
- Garbage Pile
- Overflowing Drain
- Water Leakage
- Broken Street Light
- Illegal Dumping
- Fallen Tree
- Damaged Road
- Missing Road Sign


Department mapping:

Pothole/Damaged Road:
Municipal Corporation

Garbage:
Waste Management Company

Broken Traffic Light:
Traffic Engineering & Planning Agency (TEPA)

Water Leakage/Drain:
Water and Sanitation Agency (WASA)

Street Light:
Municipal Corporation

Fallen Tree:
Parks and Horticulture Authority (PHA)


Severity:
Low, Medium, High


Return JSON only.
No explanation.

"""



# =============================
# JSON CLEANER
# =============================

def clean_json_text(text):

    if not text:
        return ""


    text = text.strip()


    if text.startswith("```"):

        lines = text.splitlines()


        if lines and lines[0].startswith("```"):
            lines = lines[1:]


        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]


        text = "\n".join(lines)


    return text.strip()



# =============================
# RESPONSE EXTRACTOR
# =============================

def extract_response_text(response):

    """
    Extract Gemma output from all response parts.
    """

    # Try normal text
    try:
        text = response.text
        if text:
            return text
    except Exception:
        pass


    # Try candidates
    try:
        candidates = response.candidates

        collected = ""

        for candidate in candidates:

            if candidate.content and candidate.content.parts:

                for part in candidate.content.parts:

                    if hasattr(part, "text") and part.text:
                        collected += part.text


        if collected.strip():
            return collected.strip()

    except Exception as e:
        print("Extraction Error:", e)


    return ""


# =============================
# GEMMA RETRY FUNCTION
# =============================

def generate_content_with_retries(
        client,
        model,
        contents,
        config,
        max_retries=3
):


    last_exception = None



    for attempt in range(1, max_retries + 1):

        try:

            print("\n========== GEMMA REQUEST ==========")

            print(
                "Attempt:",
                attempt
            )

            print(
                "Model:",
                model
            )


            response = client.models.generate_content(

                model=model,

                contents=contents,

                config=config

            )



            response_text = extract_response_text(
                response
            )


            print("\n========== GEMMA RESPONSE ==========")

            print(
                response_text
            )

            print(
                "===================================="
            )

            if response_text.strip():
                return response

            raise Exception(
                "Gemma returned empty output"
            )

        except Exception as e:


            last_exception = e


            error = str(e)


            print("\n========== ERROR ==========")

            print(error)



            retryable = (
                "empty output" in error.lower()
                or any(
                    code in error
                    for code in [
                        "429",
                        "500",
                        "503",
                        "504",
                        "MAX_TOKENS"
                    ]
                )
            )



            if retryable and attempt < max_retries:


                wait = attempt * 2


                print(
                    f"Retrying after {wait} seconds..."
                )


                time.sleep(wait)



            else:

                raise last_exception




# =============================
# IMAGE ISSUE DETECTION
# =============================

def detect_issue(
        image_path,
        latitude=None,
        longitude=None,
        address=None,
        place_id=None,
        map_pin=None,
        language="English"
):


    try:


        client = get_genai_client()



        print(
            "\n[INFO] Starting Vision Detection:",
            image_path
        )



        with Image.open(image_path) as image:


            image = image.convert(
                "RGB"
            )


            image.thumbnail(
                (512,512)
            )


            buffer = io.BytesIO()


            image.save(
                buffer,
                format="JPEG",
                quality=70
            )


            image_bytes = buffer.getvalue()



        if address:
            location_text = f"Address: {address}"
        elif latitude and longitude:
            location_text = (
                f"Latitude: {latitude}, Longitude: {longitude}"
            )
        else:
            location_text = "Location not provided"

        vision_prompt = (
            STEP1_PROMPT
            + f"\n\nLocation context:\n{location_text}\n"
        )

        contents = [

            types.Content(

                role="user",

                parts=[

                    types.Part.from_text(
                        text=vision_prompt
                    ),


                    types.Part.from_bytes(

                        data=image_bytes,

                        mime_type="image/jpeg"

                    )

                ]

            )

        ]



        response = generate_content_with_retries(

            client=client,

            model=MODEL_NAME,

            contents=contents,


            config=types.GenerateContentConfig(
    response_mime_type="application/json",
    temperature=0.1,
    max_output_tokens=1000
)

        )



        raw_text = extract_response_text(response)



        print(
            "\n========== RAW JSON =========="
        )

        print(
            raw_text
        )


        cleaned = clean_json_text(
            raw_text
        )



        result = json.loads(
            cleaned
        )



        final_result = {

            "issue":
            result.get(
                "issue",
                "Unknown"
            ),


            "reason":
            result.get(
                "reason",
                ""
            ),


            "severity":
            result.get(
                "severity",
                "Medium"
            ),


            "department":
            result.get(
                "department",
                "Municipal Corporation"
            )

        }



        return json.dumps(
            final_result,
            indent=4,
            ensure_ascii=False
        )



    except Exception as e:


        print(
            "\nVision Error:",
            e
        )


        traceback.print_exc()



        return json.dumps({

            "issue":
            "AI Analysis Failed",


            "reason":
            str(e),


            "severity":
            "Medium",


            "department":
            "Municipal Corporation"

        })
    
    # =============================
# STEP 2: COMPLAINT GENERATION
# =============================

def generate_complaint(
        issue,
        reason,
        severity,
        department,
        latitude=None,
        longitude=None,
        address=None,
        language="English"
):


    fallback_complaint = {

        "complaint_subject":
        f"Urgent Complaint Regarding {issue}",


        "complaint_body":

        (
            "Respected Sir/Madam,\n\n"

            f"I would like to bring your attention to the issue of {issue}. "

            f"The problem has been identified as {reason}. "

            "This issue is causing inconvenience to citizens "
            "and may create safety concerns.\n\n"

            f"I request the {department} to inspect the location "
            "and take necessary action as soon as possible.\n\n"

            "Yours sincerely,\n"
            "A concerned citizen"
        )

    }



    try:


        client = get_genai_client()



        if address:

            location = address


        elif latitude and longitude:

            location = (
                f"Latitude: {latitude}, "
                f"Longitude: {longitude}"
            )


        else:

            location = "Location not provided"



        prompt = f"""

You are Raabta AI.

Write a formal civic complaint for Pakistan.

Input:

Issue:
{issue}


Reason:
{reason}


Severity:
{severity}


Department:
{department}


Location:
{location}



Return ONLY JSON.

Format:

{{
 "complaint_subject":"",
 "complaint_body":""
}}


Rules:

- Complaint must start with:

Respected Sir/Madam,


- Sound like a real citizen.
- Keep it polite and formal.
- Mention public inconvenience.
- Request urgent action.
- Do not mention AI or Gemma.
- End with:

Yours sincerely,
A concerned citizen


"""



        contents = [

            types.Content(

                role="user",

                parts=[

                    types.Part.from_text(
                        text=prompt
                    )

                ]

            )

        ]



        response = generate_content_with_retries(

            client=client,

            model=MODEL_NAME,

            contents=contents,


            config=types.GenerateContentConfig(
    response_mime_type="application/json",
    temperature=0.2,
    max_output_tokens=1000
)

        )



        raw_text = extract_response_text(response)



        print(
            "\n========== COMPLAINT JSON =========="
        )

        print(
            raw_text
        )



        cleaned = clean_json_text(
            raw_text
        )



        complaint = json.loads(
            cleaned
        )



        return {


            "complaint_subject":

            complaint.get(

                "complaint_subject",

                f"Complaint Regarding {issue}"

            ),



            "complaint_body":

            complaint.get(

                "complaint_body",

                ""

            )

        }



    except Exception as e:


        print(
            "\nComplaint Generation Error:",
            e
        )


        traceback.print_exc()


        return fallback_complaint


        # =============================
# STEP 1 VOICE: TEXT ANALYSIS
# =============================

def detect_issue_from_text(text):


    fallback_object = {

        "issue":
        "General Civic Issue",


        "reason":
        text,


        "severity":
        "Medium",


        "department":
        "Municipal Corporation"

    }



    try:


        client = get_genai_client()



        print(
            "\n[INFO] Voice Text Analysis:"
        )

        print(
            text
        )



        prompt = f"""

Analyze this citizen complaint.

Complaint:

{text}


Return ONLY JSON.

Format:

{{
 "issue":"",
 "reason":"",
 "severity":"",
 "department":""
}}


Rules:


Garbage:
Waste Management Company


Pothole or Road Damage:
Municipal Corporation


Broken Traffic Light:
Traffic Engineering & Planning Agency (TEPA)


Water Leakage or Drain:
Water and Sanitation Agency (WASA)


Street Light:
Municipal Corporation


Electricity:
Electricity Department



Severity:
Low, Medium, High


No explanation.
No markdown.
Only JSON.

"""



        contents = [

            types.Content(

                role="user",

                parts=[

                    types.Part.from_text(
                        text=prompt
                    )

                ]

            )

        ]



        response = generate_content_with_retries(

            client=client,

            model=MODEL_NAME,

            contents=contents,


            config=types.GenerateContentConfig(
    response_mime_type="application/json",
    temperature=0,
    max_output_tokens=1000
)

        )



        raw_text = extract_response_text(response)



        print(
            "\n========== VOICE JSON =========="
        )

        print(
            raw_text
        )



        if not raw_text.strip():

            print(
                "Empty response from Gemma"
            )

            return fallback_object



        cleaned = clean_json_text(
            raw_text
        )



        result = json.loads(
            cleaned
        )



        final_result = {


            "issue":

            result.get(

                "issue",

                "General Civic Issue"

            ),



            "reason":

            result.get(

                "reason",

                text

            ),



            "severity":

            result.get(

                "severity",

                "Medium"

            ),



            "department":

            result.get(

                "department",

                "Municipal Corporation"

            )

        }



        print(
            "\n========== PARSED VOICE RESULT =========="
        )


        print(
            json.dumps(
                final_result,
                indent=4,
                ensure_ascii=False
            )
        )



        return final_result



    except Exception as e:


        print(
            "\nVoice Analysis Error:",
            e
        )


        traceback.print_exc()



        return fallback_object