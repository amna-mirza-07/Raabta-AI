# 🇵🇰 Raabta AI

### AI-Powered Civic Issue Reporting Platform

**Raabta AI** is an intelligent civic reporting platform that makes it easier for citizens to report public issues such as road damage, garbage, broken infrastructure, and other community problems.

Users can report an issue using **text, images, or voice**. Raabta AI uses AI to understand the complaint, identify the issue, and help route it to the relevant department.

> **Report it. Understand it. Route it. Raabta AI.**

---

## 🚀 Features

### 📝 Text Reporting

Describe a civic issue in your own words and let AI analyze the complaint.

### 📸 Image-Based Reporting

Upload or capture an image of a civic problem. AI analyzes the image and identifies the reported issue.

### 🎙️ Voice Reporting

Speak your complaint naturally in Urdu. The system uses **Whisper** for speech-to-text transcription.

### 🤖 AI-Powered Analysis

Google Gemini analyzes reports and generates structured information from unstructured user input.

### 🏢 Department Routing

Raabta AI identifies the appropriate department for the reported issue, helping complaints reach the right authority.

### 🗺️ Location Support

Reports can include the user's location, with reverse geocoding used to identify the corresponding address.

### 🔊 Voice Response

Voice-based interaction is supported through **Edge-TTS**, allowing the system to generate spoken responses.

### 🌐 Accessible Interface

The platform is designed with a simple, user-friendly interface so citizens can report problems without needing technical knowledge.

---

## 💡 Problem

Citizens frequently encounter problems such as:

* Potholes and damaged roads
* Garbage and waste accumulation
* Broken street infrastructure
* Damaged public facilities
* Other civic and municipal issues

However, reporting these problems can be confusing or time-consuming. Citizens may not know:

* Which department is responsible
* What information they need to provide
* How to describe the issue properly
* Where exactly to submit the complaint

Raabta AI simplifies this process by allowing citizens to **simply describe or show the problem**.

---

## 💡 Our Solution

Raabta AI acts as an intelligent bridge between citizens and civic authorities.

### The workflow:

```text
Citizen
   ↓
Text / Image / Voice
   ↓
Raabta AI
   ↓
AI Analysis
   ↓
Issue Identification
   ↓
Department Routing
   ↓
Structured Civic Report
```

Instead of requiring users to understand government department structures, the AI helps determine where the complaint belongs.

---

## 🧠 AI Technologies

### Google Gemini

Used for intelligent analysis of user reports, including:

* Understanding complaint descriptions
* Structuring report information
* Identifying civic issues
* Supporting department classification

### Faster-Whisper

Used for speech-to-text conversion.

The voice reporting system supports Urdu speech and converts spoken complaints into text before processing them further.

### Edge-TTS

Used to generate spoken responses from text, enabling a more natural voice-based reporting experience.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS

### Backend

* Python
* Flask
* Flask-CORS

### AI / ML

* Google Gemini
* Faster-Whisper
* Edge-TTS

### Other Technologies

* Pillow
* Python-dotenv
* Git & GitHub

---

## 📁 Project Structure

```text
Raabta-AI/
│
├── backEnd/
│   ├── app.py
│   ├── requirements.txt
│   │
│   ├── routes/
│   │   ├── report.py
│   │   └── voice_report.py
│   │
│   └── services/
│       ├── voice_input.py
│       └── voice_output.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── routes.jsx
│   │
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/amna-mirza-07/Raabta-AI.git
cd Raabta-AI
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backEnd
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 3. Environment Variables

Create a `.env` file inside the backend directory.

```env
GEMINI_API_KEY=your_api_key_here
```

**Never commit your real API key to GitHub.**

---

### 4. Start the Backend

```bash
python app.py
```

The Flask server should start on:

```text
http://127.0.0.1:5000
```

---

### 5. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint            | Purpose                  |
| ------ | ------------------- | ------------------------ |
| POST   | `/api/report`       | Image-based civic report |
| POST   | `/api/text-report`  | Text-based civic report  |
| POST   | `/api/voice-report` | Voice-based civic report |

---

## 🔐 Environment Variables

The application uses environment variables for sensitive configuration.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

For the Vite frontend:

```env
VITE_API_URL=http://127.0.0.1:5000
```

For production, replace the local backend URL with the deployed backend URL.

---

## 🌍 Deployment

### Frontend

The React frontend is deployed using **Vercel**.

### Backend

The Flask backend must be deployed separately and the frontend's `VITE_API_URL` should point to the deployed backend.

---

## 🧪 Supported Reporting Methods

| Reporting Method  | AI Processing     | Supported |
| ----------------- | ----------------- | --------- |
| 📝 Text           | Gemini            | ✅         |
| 📸 Image          | Gemini Vision     | ✅         |
| 🎙️ Voice         | Whisper + Gemini  | ✅         |
| 🔊 Voice Response | Edge-TTS          | ✅         |
| 📍 Location       | Reverse Geocoding | ✅         |

---

## 🎯 Why Raabta AI?

Traditional civic reporting systems often expect citizens to know **where and how** to file a complaint.

Raabta AI changes that approach.

Instead of asking:

> "Which department should I report this to?"

Citizens can simply say:

> **"There's a large pothole outside my street."**

or upload a picture of it.

Raabta AI handles the intelligence behind the report.

---

## 🔮 Future Improvements

Potential future improvements include:

* 📊 Civic issue analytics dashboard
* 🏛️ Direct integration with government complaint systems
* 📱 Dedicated mobile application
* 🗺️ Interactive civic issue map
* 🔔 Real-time complaint status notifications
* 🌐 Additional regional languages
* 👤 Citizen complaint history
* 📈 Government-side analytics and monitoring
* ⚡ Faster AI processing and optimized model deployment

---

## 🏆 Built For

**AI / Hackathon Project**

Raabta AI was developed to explore how artificial intelligence can make civic engagement more accessible, intelligent, and user-friendly.

---

## 👥 Team

**Raabta AI Team**

Built with ❤️ using AI, Python, React, and modern web technologies.

---

## 📄 License

This project is created for educational, experimental, and hackathon purposes.
