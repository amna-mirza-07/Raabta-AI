const rawApiUrl = import.meta.env.VITE_API_URL || "/api"
const trimmedApiUrl = rawApiUrl.replace(/\/+$/, "")
const API_BASE = trimmedApiUrl === "" || trimmedApiUrl === "/api"
  ? "/api"
  : (trimmedApiUrl.endsWith("/api") ? trimmedApiUrl : `${trimmedApiUrl}/api`)

export async function checkHealth() {
  return requestJson("/health", {
    method: "GET"
  })
}


async function requestJson(endpoint, options = {}) {

  let response
  try {
    response = await fetch(
      `${API_BASE}${endpoint}`,
      options
    )
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      if (API_BASE.includes("127.0.0.1") || API_BASE.includes("localhost")) {
        throw new Error(
          `Cannot reach backend at ${API_BASE}. In production on Vercel, you must configure VITE_API_URL in Vercel Project Settings to your deployed backend HTTPS URL.`
        )
      }
      throw new Error(
        `Failed to connect to backend at ${API_BASE}. Please verify that your backend server is awake and accepting requests.`
      )
    }
    throw err
  }

  const result = await response.json().catch(
    () => ({})
  )

  if(!response.ok){
    throw new Error(
      result.error ||
      result.message ||
      `Request failed ${response.status}`
    )
  }

  return result
}



// =================================
// IMAGE COMPLAINT
// =================================

export async function submitImageComplaint({
  image,
  latitude,
  longitude,
  location
}){


  const formData = new FormData()


  if(image){

    formData.append(
      "image",
      image
    )

  }


  if(latitude){

    formData.append(
      "latitude",
      latitude
    )

  }


  if(longitude){

    formData.append(
      "longitude",
      longitude
    )

  }


  if(location){

    formData.append(
      "location",
      location
    )

  }



  return requestJson(
    "/report",
    {
      method:"POST",
      body:formData
    }
  )

}





// =================================
// VOICE COMPLAINT
// =================================

export async function submitVoiceComplaint(
  audioFile,
  location
){


  const formData = new FormData()


  formData.append(
    "audio",
    audioFile
  )


  if(location){

    formData.append(
      "location",
      location
    )

  }



  return requestJson(
    "/voice-report",
    {
      method:"POST",
      body:formData
    }
  )

}





// =================================
// TEXT COMPLAINT
// =================================

export async function submitTextComplaint({
  text,
  latitude,
  longitude,
  location
}){


  const formData = new FormData()


  formData.append(
    "text",
    text
  )


  if (latitude) {
    formData.append("latitude", latitude)
  }


  if (longitude) {
    formData.append("longitude", longitude)
  }


  if (location) {
    formData.append("location", location)
  }



  return requestJson(
    "/text-report",
    {
      method:"POST",
      body:formData
    }
  )

}





// =================================
// OLD SUPPORT
// =================================

export async function submitReport(data){

  return submitImageComplaint(data)

}