import {
  submitImageComplaint,
  submitVoiceComplaint,
  submitTextComplaint
} from "../services/api"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import { 
  Camera, 
  Mic, 
  FileText, 
  MapPin, 
  Copy, 
  Download, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  Info,
  CheckCircle,
  AlertTriangle,
  Brain,
  Compass,
  Building,
  Landmark,
  Map,
  Flag,
  Hash
} from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15)
    }
  }, [lat, lng, map])
  return null
}

const inputModes = [
  {
    id: "image",
    label: "Camera / Image",
    icon: Camera,
    description: "Capture or upload an issue image."
  },
  {
    id: "voice",
    label: "Voice Recorder",
    icon: Mic,
    description: "Record a complaint voice note."
  },
  {
    id: "text",
    label: "Write Text",
    icon: FileText,
    description: "Describe the civic problem."
  },
]

const processingStepsList = [
  "Uploading...",
  "Analyzing...",
  "Gemma Processing...",
  "Identifying Issue...",
  "Finding Department...",
  "Generating Complaint...",
  "Preparing Report...",
  "Completed."
]

function normalizeResult(mode, payload = {}) {
  const aiResult =
    typeof payload.issue === "object"
    ? payload.issue
    : typeof payload.ai_result === "object"
    ? payload.ai_result
    : {}

  const complaint =
    typeof payload.complaint === "object"
    ? payload.complaint
    : {}

  return {
    mode,
    issue: aiResult.issue || "General civic issue",
    reason: aiResult.reason || "No reason provided",
    severity: aiResult.severity || "Medium",
    department: aiResult.department || payload.department || "Municipal Department",
    subject: complaint.subject || complaint.complaint_subject || "Civic Complaint Report",
    body: complaint.body || complaint.complaint_body || "Complaint generated successfully.",
    transcription: payload.transcription || "",
    voiceText: payload.voice_text || "",
    location: payload.location || {}
  }
}

function parseAddress(fullAddress) {
  if (!fullAddress || 
      fullAddress === "Location not provided" || 
      fullAddress === "Location not found" || 
      fullAddress === "Location not available" ||
      !fullAddress.includes(',')) {
    return {
      street: fullAddress || "Awaiting GPS...",
      area: "Awaiting GPS...",
      city: "Awaiting GPS...",
      district: "Awaiting GPS...",
      province: "Awaiting GPS...",
      postalCode: "Awaiting GPS...",
      country: "Pakistan"
    }
  }
  
  const parts = fullAddress.split(',').map(p => p.trim());
  const country = parts[parts.length - 1] || "Pakistan";
  const postalCode = parts.find(p => /^\d{5}$/.test(p)) || "Unknown";
  
  const street = parts[0] || "";
  const area = parts[1] || parts[2] || "";
  
  const district = parts.find(p => p.toLowerCase().includes("district") || p.toLowerCase().includes("cantonment") || p.toLowerCase().includes("tehsil")) || parts[parts.length - 4] || "";
  const city = parts.find(p => 
    p.includes("Lahore") || p.includes("Karachi") || p.includes("Islamabad") || 
    p.includes("Rawalpindi") || p.includes("Peshawar") || p.includes("Quetta") || 
    p.includes("Faisalabad") || p.includes("Multan")
  ) || parts[2] || "";
  
  const province = parts.find(p => 
    p.includes("Punjab") || p.includes("Sindh") || p.includes("Khyber Pakhtunkhwa") || 
    p.includes("Balochistan") || p.includes("Capital Territory") || p.includes("Gilgit")
  ) || parts[parts.length - 3] || "";

  return {
    street,
    area,
    city,
    district: district || city || "Lahore District",
    province,
    postalCode,
    country
  }
}

function SubmitComplaintPage() {
  const [searchParams] = useSearchParams()
  const [inputMode, setInputMode] = useState(() => {
    const mode = new URLSearchParams(window.location.search).get("mode")
    return (mode && ["image", "voice", "text"].includes(mode)) ? mode : "image"
  })
  const [textInput, setTextInput] = useState("")
  const [capturedImageBlob, setCapturedImageBlob] = useState(null)
  const [capturedImagePreview, setCapturedImagePreview] = useState("")
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null)
  const [recordedAudioPreview, setRecordedAudioPreview] = useState("")
  const [locationText, setLocationText] = useState("")
  
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [processingStage, setProcessingStage] = useState(0)
  
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingStatus, setRecordingStatus] = useState("idle")
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const imageInputRef = useRef(null)
  const audioInputRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Parse mode query parameter
  useEffect(() => {
    const mode = searchParams.get("mode")
    if (mode && ["image", "voice", "text"].includes(mode)) {
      const timer = setTimeout(() => {
        setInputMode(mode)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Cleanup WebRTC Camera & Voice Synthesis on Unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Sequential stage simulation while processing
  useEffect(() => {
    if (!isProcessing) return

    const timer = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < processingStepsList.length - 2) {
          return prev + 1
        }
        return prev
      })
    }, 1100)

    return () => clearInterval(timer)
  }, [isProcessing])

  // Get current address from Nominatim (only on GPS detect click)
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      return
    }
    setIsFetchingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLatitude(lat)
        setLongitude(lng)
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}&accept-language=en`, {
            headers: {
              "User-Agent": "RaabtaAI/1.0"
            }
          })
          const data = await res.json()
          if (data && data.display_name) {
            setLocationText(data.display_name)
          } else {
            setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          }
        } catch (err) {
          console.error("OSM Geocoding Error:", err)
          setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        } finally {
          setIsFetchingLocation(false)
        }
      },
      (err) => {
        console.error(err)
        setError("Unable to retrieve GPS location automatically.")
        setIsFetchingLocation(false)
      }
    )
  }

  // Detect location on component mount automatically
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      detectLocation()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  // Timer for Audio Recording
  useEffect(() => {
    let timer
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRecording])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      streamRef.current = stream
      setIsCameraActive(true)
      setError("")
    } catch (err) {
      console.error(err)
      setError("Camera access denied or unavailable.")
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (!streamRef.current || !videoRef.current) {
      setError("Camera is not active.")
      return
    }

    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-image.jpg", { type: "image/jpeg" })
        setCapturedImageBlob(file)
        setCapturedImagePreview(URL.createObjectURL(file))
        closeCamera()
        setError("")
      }
    }, "image/jpeg")
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setCapturedImageBlob(file)
    setCapturedImagePreview(URL.createObjectURL(file))
    setError("")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setCapturedImageBlob(file)
      setCapturedImagePreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const file = new File([blob], "voice.webm", { type: "audio/webm" })
        setRecordedAudioBlob(file)
        setRecordedAudioPreview(URL.createObjectURL(file))
        setIsRecording(false)
        setRecordingStatus("stopped")
        
        stream.getTracks().forEach(t => t.stop())
      }

      recorder.start()
      setIsRecording(true)
      setRecordingDuration(0)
      setRecordingStatus("recording")
      setError("")
    } catch (err) {
      console.error(err)
      setError("Microphone permission denied.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  const handleVoiceUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setRecordedAudioBlob(file)
    setRecordedAudioPreview(URL.createObjectURL(file))
    setError("")
    setIsRecording(false)
    setRecordingStatus("stopped")
    setRecordingDuration(0)
  }

  // Browser Urdu SpeechSynthesis with English Fallback
  const speakConfirmation = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()

      const exactUrduText = "السلام علیکم۔ آپ کی شکایت کامیابی سے درج کر دی گئی ہے۔ آپ کی درخواست متعلقہ محکمے کو بھیج دی گئی ہے۔ شکریہ کہ آپ نے رابطہ اے آئی استعمال کیا۔ اللہ حافظ۔"
      
      const playSpeech = () => {
        const voices = window.speechSynthesis.getVoices()
        // Search for ur-PK, ur-IN, or any language code starting with "ur", or name containing "urdu"
        const urduVoice = voices.find(v => {
          const lang = v.lang.toLowerCase()
          const name = v.name.toLowerCase()
          return lang.startsWith("ur-") || lang === "ur" || name.includes("urdu")
        })

        const utterance = new SpeechSynthesisUtterance()

        if (urduVoice) {
          utterance.text = exactUrduText
          utterance.voice = urduVoice
          utterance.lang = urduVoice.lang
        } else {
          console.warn("Urdu voice not supported. Falling back to English.")
          const englishText = "Assalam-o-Alaikum. Your complaint has been successfully registered. Your request has been sent to the relevant department. Thank you for using Raabta AI. Allah Hafiz."
          utterance.text = englishText
          utterance.lang = "en-US"
          const englishVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-GB") || v.name.includes("Google") || v.lang.startsWith("en"))
          if (englishVoice) {
            utterance.voice = englishVoice
          }
        }

        utterance.rate = 0.85
        utterance.pitch = 1.0
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
      }

      // Handle async voice loading
      const voices = window.speechSynthesis.getVoices()
      if (voices && voices.length > 0) {
        playSpeech()
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          playSpeech()
          window.speechSynthesis.onvoiceschanged = null
        }
        // Fallback in case onvoiceschanged does not fire
        setTimeout(playSpeech, 300)
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setResult(null)
    setIsProcessing(true)
    setProcessingStage(0)

    try {
      let response
      if (inputMode === "image") {
        if (!capturedImageBlob) {
          throw new Error("Please upload or capture an image first.")
        }
        const imageFile = new File([capturedImageBlob], "complaint.jpg", { type: "image/jpeg" })
        response = await submitImageComplaint({
          image: imageFile,
          latitude: latitude,
          longitude: longitude,
          location: locationText || "Unknown Location"
        })
      } else if (inputMode === "voice") {
        if (!recordedAudioBlob) {
          throw new Error("Please record or upload a voice note first.")
        }
        response = await submitVoiceComplaint(
          recordedAudioBlob,
          locationText || "Unknown Location"
        )
      } else {
        if (!textInput.trim()) {
          throw new Error("Please write a text description of the complaint.")
        }
        response = await submitTextComplaint({
          text: textInput,
          latitude: latitude,
          longitude: longitude,
          location: locationText || "Unknown Location"
        })
      }

      const finalResult = normalizeResult(inputMode, response)
      setResult(finalResult)
      
      // Auto-trigger speech confirmation
      setTimeout(() => {
        speakConfirmation()
      }, 500)

    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to process AI complaint.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setResult(null)
    setCapturedImageBlob(null)
    setCapturedImagePreview("")
    setRecordedAudioBlob(null)
    setRecordedAudioPreview("")
    setTextInput("")
    setRecordingDuration(0)
    setRecordingStatus("idle")
    setError("")
    setIsSpeaking(false)
  }

  // Dynamic Official PDF Generator with green banner branding
  const downloadPDF = () => {
    if (!result) return

    const runDownload = () => {
      const doc = new window.jspdf.jsPDF()
      
      // Government Green Banner Header
      doc.setFillColor(0, 108, 53) // #006C35
      doc.rect(0, 0, 210, 45, 'F')
      
      doc.setFont("Helvetica", "bold")
      doc.setFontSize(22)
      doc.setTextColor(255, 255, 255)
      doc.text("GOVERNMENT OF PAKISTAN", 20, 20)
      
      doc.setFontSize(10)
      doc.setFont("Helvetica", "normal")
      doc.setTextColor(223, 245, 232) // #DFF5E8
      doc.text("NATIONAL CIVIC DISPATCH CELL • GRIEVANCE RECORD DOSSIER", 20, 30)

      doc.setFont("Helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor(0, 108, 53)
      doc.text("OFFICIAL CASE DOSSIER SHEETS", 20, 58)
      
      // Details Block
      const items = [
        ["Reporting Channel:", inputMode.toUpperCase()],
        ["Grievance Type:", result.issue],
        ["Assigned Department:", result.department],
        ["Severity Level:", result.severity.toUpperCase()],
        ["Audited Site Address:", result.location.address || locationText || "Pakistan"]
      ]

      doc.setFontSize(10)
      let y = 68
      items.forEach(([label, val]) => {
        doc.setFont("Helvetica", "bold")
        doc.setTextColor(15, 23, 42)
        doc.text(label, 20, y)
        
        doc.setFont("Helvetica", "normal")
        const wrappedVal = doc.splitTextToSize(val, 120)
        doc.text(wrappedVal, 65, y)
        y += (wrappedVal.length * 5) + 2
      })

      // Divider Line
      doc.setDrawColor(0, 108, 53)
      doc.line(20, y + 2, 190, y + 2)
      y += 12

      // Subject
      doc.setFont("Helvetica", "bold")
      doc.setTextColor(0, 108, 53)
      doc.text("SUBJECT:", 20, y)
      doc.setFont("Helvetica", "normal")
      doc.setTextColor(15, 23, 42)
      const wrappedSubject = doc.splitTextToSize(result.subject, 150)
      doc.text(wrappedSubject, 45, y)
      y += (wrappedSubject.length * 5) + 8

      // Body text
      doc.setFont("Helvetica", "bold")
      doc.setTextColor(0, 108, 53)
      doc.text("OFFICIAL COMPLAINT STATEMENT:", 20, y)
      y += 6

      doc.setFont("Courier", "normal")
      doc.setFontSize(9)
      doc.setTextColor(15, 23, 42)
      const wrappedBody = doc.splitTextToSize(result.body, 170)
      doc.text(wrappedBody, 20, y)
      
      // Footer Note
      doc.setFont("Helvetica", "italic")
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      doc.text("This is an AI-generated civic complaint registered via Raabta AI, validated on location via GPS coordinates.", 20, 280)
      
      doc.save(`Raabta_Grievance_${result.issue.replace(/\s+/g, '_')}.pdf`)
    }

    if (window.jspdf) {
      runDownload()
    } else {
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      script.onload = () => {
        window.jspdf = window.jspdf || window.jspdf
        runDownload()
      }
      document.body.appendChild(script)
    }
  }

  const addrDetails = parseAddress(result ? (result.location.address || result.locationText || locationText) : locationText)

  return (
    <div className="studio-grid">
      {/* LEFT COLUMN: INPUT CONTROLS & LOCATION */}
      <div className="space-y-6">
        
        {/* Switch Segment Card */}
        <section className="glass-panel space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              <span>Grievance Studio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a dispatch channel to record details.</p>
          </div>

          <div className="mode-segmented-switch">
            {inputModes.map(mode => {
              const Icon = mode.icon
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setInputMode(mode.id)
                    setError("")
                  }}
                  className={`mode-switch-btn ${inputMode === mode.id ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{mode.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* INPUT MODE SUBSECTION */}
        <section className="glass-panel space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reporter Interface</h3>

          {/* 1. IMAGE PORTAL */}
          {inputMode === "image" && (
            <div className="space-y-4">
              <div 
                className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !capturedImagePreview && imageInputRef.current.click()}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
                
                {capturedImagePreview ? (
                  <div className="w-full relative group">
                    <img
                      src={capturedImagePreview}
                      alt="Civic damage report preview"
                      className="w-full max-h-[220px] object-cover rounded-xl border border-slate-800"
                    />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          imageInputRef.current.click()
                        }}
                        className="btn-secondary py-2 px-4 text-xs"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-[#006c35]/10 border border-[#006c35]/30 flex items-center justify-center text-emerald-400">
                      <Camera size={22} />
                    </div>
                    <p className="text-sm font-semibold text-slate-200">Drag & Drop Image here</p>
                    <p className="text-xs text-slate-400">or click to browse filesystem</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={isCameraActive ? closeCamera : openCamera}
                  className={`btn-secondary flex-1 py-2.5 text-sm ${isCameraActive ? 'border-red-500/30 text-red-400 bg-red-500/5' : ''}`}
                >
                  {isCameraActive ? "Close Camera" : "Open System Camera"}
                </button>
                {isCameraActive && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="btn-primary py-2.5 px-4 text-sm"
                  >
                    Capture Photo
                  </button>
                )}
                {capturedImagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedImageBlob(null)
                      setCapturedImagePreview("")
                    }}
                    className="btn-danger p-2.5"
                    aria-label="Remove image"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {isCameraActive && (
                <div className="map-glow-container relative h-48 bg-black">
                  <video
                    ref={(el) => {
                      videoRef.current = el
                      if (el && streamRef.current && el.srcObject !== streamRef.current) {
                        el.srcObject = streamRef.current
                        el.play().catch(e => console.error("Camera playback error:", e))
                      }
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* 2. VOICE PORTAL */}
          {inputMode === "voice" && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 flex flex-col items-center gap-4 text-center">
                <div className={`recording-mic-indicator ${isRecording ? 'active' : ''}`} style={{ color: 'var(--color-primary-hover)', borderColor: 'var(--color-primary-hover)', backgroundColor: 'rgba(0, 108, 53, 0.08)' }}>
                  <Mic size={24} />
                </div>
                
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Voice Dispatch Rec</span>
                  <span className="text-lg font-bold text-slate-100 mt-1 block">
                    {isRecording ? "Transmitting Audio Note..." : recordedAudioPreview ? "Note Compiled" : "Press Start to record in English/Urdu"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`btn-primary px-6 py-2.5 ${isRecording ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : ''}`}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                  <button
                    type="button"
                    onClick={() => audioInputRef.current.click()}
                    className="btn-secondary py-2.5 px-4 text-sm"
                  >
                    Upload Voice Note
                  </button>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    hidden
                    onChange={handleVoiceUpload}
                  />
                </div>

                {(isRecording || recordingStatus === "stopped") && (
                  <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-900 pt-4 mt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Note Duration</span>
                      <span className="text-sm font-mono font-bold text-slate-200">{formatTime(recordingDuration)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Record Status</span>
                      <span className="text-sm font-bold text-slate-200">{isRecording ? "🔴 RECORDING" : "✅ ENCODED"}</span>
                    </div>
                  </div>
                )}
              </div>

              {recordedAudioPreview && (
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/30 border border-slate-800">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Playback Audio Note</label>
                  <audio
                    controls
                    src={recordedAudioPreview}
                    className="w-full h-8"
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. TEXT PORTAL */}
          {inputMode === "text" && (
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Describe the civic grievance (e.g. Garbage piling on main street, water board leakage, road pothole)..."
                  className="w-full h-36 p-4 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none text-sm leading-relaxed"
                  maxLength={1000}
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-semibold text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  {textInput.length}/1000
                </span>
              </div>
            </div>
          )}
        </section>

        {/* MAP SECTION (LOCATION CARD) */}
        <section className="glass-panel space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              <span>Location Card</span>
            </h3>
            <button
              type="button"
              onClick={detectLocation}
              disabled={isFetchingLocation}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 transition flex items-center gap-1 cursor-pointer"
            >
              {isFetchingLocation ? "📍 Locating..." : "📍 Detect Location"}
            </button>
          </div>

          <div className="grid gap-3">
            {latitude && longitude && (
              <div className="map-glow-container h-44 relative z-10">
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[latitude, longitude]}>
                    <Popup>Audit Coordinates</Popup>
                  </Marker>
                  <RecenterMap lat={latitude} lng={longitude} />
                </MapContainer>
              </div>
            )}

            <div className="rounded-xl border border-slate-900 bg-slate-950/30 p-4 space-y-2.5">
              <div className="location-item-row">
                <span className="location-item-label flex items-center gap-2">
                  <MapPin size={13} className="text-emerald-500" />
                  <span>Street</span>
                </span>
                <span className="location-item-value" title={addrDetails.street}>{addrDetails.street}</span>
              </div>
              <div className="location-item-row">
                <span className="location-item-label flex items-center gap-2">
                  <Compass size={13} className="text-emerald-500" />
                  <span>Area</span>
                </span>
                <span className="location-item-value">{addrDetails.area}</span>
              </div>
              <div className="location-item-row">
                <span className="location-item-label flex items-center gap-2">
                  <Building size={13} className="text-emerald-500" />
                  <span>City</span>
                </span>
                <span className="location-item-value">{addrDetails.city}</span>
              </div>
              <div className="location-item-row">
                <span className="location-item-label flex items-center gap-2">
                  <Landmark size={13} className="text-emerald-500" />
                  <span>District</span>
                </span>
                <span className="location-item-value">{addrDetails.district}</span>
              </div>
              <div className="location-item-row">
                <span className="location-item-label flex items-center gap-2">
                  <Map size={13} className="text-emerald-500" />
                  <span>Province</span>
                </span>
                <span className="location-item-value">{addrDetails.province}</span>
              </div>
              <div className="location-item-row">
                <span className="location-item-label flex items-center gap-2">
                  <Hash size={13} className="text-emerald-500" />
                  <span>Postal Code</span>
                </span>
                <span className="location-item-value">{addrDetails.postalCode}</span>
              </div>
              <div className="location-item-row">
                <span className="location-item-label flex items-center gap-2">
                  <Flag size={13} className="text-emerald-500" />
                  <span>Country</span>
                </span>
                <span className="location-item-value">🇵🇰 Pakistan</span>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-rose-400 font-semibold text-xs flex items-center gap-2">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* COMPLAINT SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isProcessing}
          className="btn-primary w-full py-4 text-base relative overflow-hidden"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <RefreshCw size={18} className="animate-spin" />
              <span>Gemma AI Processing Pipeline...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span>Generate Complaint with Gemma AI</span>
            </div>
          )}
        </button>

        {/* LOADING TIMELINE PROCESS */}
        {isProcessing && (
          <section className="glass-panel">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3">
              Dispatch Verification Pipeline
            </h3>
            
            <div className="pipeline-timeline">
              {processingStepsList.map((step, idx) => {
                const isCompleted = idx < processingStage
                const isActive = idx === processingStage
                return (
                  <div 
                    key={step} 
                    className={`pipeline-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="pipeline-node-bullet" style={{ background: isCompleted ? 'var(--color-primary-hover)' : isActive ? 'var(--color-primary)' : 'var(--text-muted)' }}></div>
                    <span className="pipeline-node-title">{step}</span>
                    <span className="pipeline-node-status">
                      {isCompleted ? "Completed" : isActive ? "Active" : "Awaiting"}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* RIGHT COLUMN: AI RESPONSE WORKSPACE */}
      <aside className="glass-panel bg-slate-950/20 flex flex-col h-full min-h-[600px] gap-6">
        <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain size={18} className="text-emerald-400" />
            <span>AI Dispatch Workspace</span>
          </h3>
          {result && (
            <span className="badge badge-green flex items-center gap-1 bg-[#006c35]/15 border-[#006c35]/30 text-emerald-400">
              <CheckCircle size={10} />
              Dossier Compiled
            </span>
          )}
        </div>

        {/* SUCCESS PORTAL EXPERIENCES */}
        {result && (
          <div className="rounded-2xl border border-emerald-500/25 bg-[#006c35]/10 p-5 space-y-3.5 shadow-lg shadow-emerald-950/30 transition-all duration-300">
            <h4 className="text-sm font-bold text-[#6ee7b7] flex items-center gap-1.5 leading-none">
              <CheckCircle size={16} className="text-[#10b981]" />
              <span>Grievance Generated Successfully</span>
            </h4>
            
            <div className="grid gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Complaint Generated Successfully</span>
              </div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Thank you for using Raabta AI</span>
              </div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Department Assigned: <strong className="text-white">{result.department}</strong></span>
              </div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[#10b981] font-bold">✓</span>
                <span>Official Complaint Ready</span>
              </div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[#10b981] font-bold">✓</span>
                <span className="text-emerald-400 font-medium">Playing Urdu Voice Confirmation...</span>
              </div>
            </div>
            
            {isSpeaking && (
              <div className="voice-speak-pulse-container border-t border-slate-900 pt-3">
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
                <span className="voice-ripple-bar" style={{ background: 'linear-gradient(to top, var(--color-primary), var(--color-primary-hover))' }}></span>
              </div>
            )}
          </div>
        )}

        {result ? (
          <div className="flex-1 space-y-5">
            {/* Government style report card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 text-slate-100 backdrop-blur-sm">
              
              {/* official Pakistan Letterhead Emblem styling */}
              <div className="border-b-2 border-[#006c35] pb-4 text-center space-y-1">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#6ee7b7] uppercase leading-none">Government of Pakistan</p>
                <h3 className="text-sm font-extrabold text-white tracking-widest leading-none">NATIONAL CIVIC DISPATCH CELL</h3>
                <p className="text-[9px] font-semibold text-slate-500 uppercase leading-none">Gemma-AI Generated Grievance Record</p>
              </div>

              {/* Data grids */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Complaint Category</span>
                  <p className="font-semibold text-white mt-1 text-sm">{result.issue}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Priority Grading</span>
                  <p className="mt-1 leading-none">
                    <span className={`badge ${
                      result.severity.toLowerCase() === 'high' ? 'badge-red' :
                      result.severity.toLowerCase() === 'medium' ? 'badge-amber' :
                      'badge-blue'
                    }`}>
                      {result.severity.toUpperCase()} Priority
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Assigned Agency</span>
                  <p className="font-semibold text-white mt-1 text-sm">{result.department}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Audited Site Address</span>
                  <p className="text-slate-300 mt-1 text-xs leading-tight">
                    {result.location.address || result.locationText || locationText || "Pakistan"}
                  </p>
                </div>
              </div>

              {result.reason && (
                <div className="border-t border-slate-900 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">AI Validation Reason</span>
                  <p className="text-slate-300 mt-1 text-xs leading-relaxed">{result.reason}</p>
                </div>
              )}

              {result.transcription && (
                <div className="border-t border-slate-900 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Transcript Audited</span>
                  <p className="text-slate-300 mt-1 text-xs italic">"{result.transcription}"</p>
                </div>
              )}

              {/* Subject & Complaint dossiers */}
              <div className="border-t border-slate-900 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Official Dossier Text</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(result.body)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={12} />
                    <span>{copied ? "Copied!" : "Copy Complaint"}</span>
                  </button>
                </div>
                
                <h5 className="font-bold text-white text-xs bg-slate-950 p-3 rounded border border-slate-900 leading-snug">
                  Subject: {result.subject}
                </h5>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mt-2">Generated Complaint Dossier</span>
                <div className="rounded-xl bg-slate-950 p-4 text-slate-300 border border-slate-900 text-xs font-mono whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                  {result.body}
                </div>
              </div>

              {/* Primary action list */}
              <div className="pt-4 border-t border-slate-900 flex gap-3">
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="btn-secondary flex-1 py-3 text-xs"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-primary flex-1 py-3 text-xs"
                >
                  <RefreshCw size={14} />
                  <span>Generate Another</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 space-y-6">
            <div className="h-16 w-16 rounded-full bg-slate-900/60 flex items-center justify-center text-slate-700 border border-slate-900">
              <Info size={28} />
            </div>
            
            <div className="text-center max-w-sm space-y-2">
              <h4 className="font-bold text-slate-400">Workspace Empty</h4>
              <p className="text-xs leading-relaxed text-slate-500">
                Setup your input details on the left, then click <strong>Generate Complaint</strong> to run the Google Gemma AI workflow and draft your official case report.
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

export default SubmitComplaintPage