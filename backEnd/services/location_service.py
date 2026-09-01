import requests


def get_address(latitude, longitude):

    try:

        url = (
            f"https://nominatim.openstreetmap.org/reverse"
            f"?format=json"
            f"&lat={latitude}"
            f"&lon={longitude}"
            f"&accept-language=en"
        )

        headers = {
            "User-Agent": "RaabtaAI/1.0"
        }

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        if response.status_code != 200:

            print("Location API Error:", response.status_code)
            return "Location not available"

        data = response.json()

        if "display_name" in data:

            address = data["display_name"]

            print("\n========== LOCATION ==========")
            print(address)
            print("==============================\n")

            return address

        print("Location not found.")

        return "Location not found"

    except Exception as e:

        print("Location Error:", e)

        return "Location not available"