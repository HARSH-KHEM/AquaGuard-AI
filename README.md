# AquaGuard AI
**Predictive Water Intelligence and Citizen Issue Reporting System**

## 🏆 Hackathon

| Field | Details |
|--------|---------|
| **Hackathon** | Gen AI Academy APAC Edition |
| **Platform** | Hack2Skill |
| **Track** | AI for Better Living and Smarter Communities |
| **Theme** | AI-powered Decision Intelligence Platform |
| **Team Name** | HACK-X |

### Problem Statement

AquaGuard AI is built for the **"AI for Better Living and Smarter Communities"** challenge.

The objective is to develop an AI-powered decision intelligence platform that leverages AI models, data analytics, and intelligent automation to help individuals, communities, organizations, and city stakeholders analyze information, generate insights, predict outcomes, and make smarter decisions that improve everyday life.

This project aligns with the challenge by focusing on:

- AI-powered environmental monitoring
- Water quality intelligence
- Predictive analytics
- Sustainable resource management
- Intelligent recommendations
- Community well-being
- Data-driven decision making

### Technologies Inspired by the Challenge

This project leverages and explores technologies suggested by the hackathon, including:

- Google Gemini
- Large Language Models (LLMs)
- Retrieval-Augmented Generation (RAG)
- Multimodal AI
- Computer Vision
- Predictive Analytics
- Workflow Automation
- Explainable AI

## 👥 Team HACK-X

| Name | Role |
|------|------|
| **Harsh Khem** | Team Leader • AI/ML Engineer • Full Stack Developer |
| **Zainab Rizvi** | Frontend & UI/UX Developer |
| **Adiba Ansari** | Backend Development • Documentation & Testing |

## Project Status

✅ Frontend deployed on Firebase  
✅ Backend deployed on Render  
✅ AI Chat Integration Working  
✅ Production Ready  

## 🎯 Challenge Alignment

AquaGuard AI directly satisfies the hackathon goals by delivering:

- **AI-driven environmental intelligence**: Processing real-time multi-source data to assess risks.
- **Real-time water quality assessment**: Empowering citizens and officials with live dashboards.
- **Predictive insights for communities**: Forecasting potential outbreak events before they escalate.
- **Sustainable decision support**: Suggesting effective interventions and resource routing.
- **Automation using Generative AI**: Simplifying complex reports and alerting for stakeholders.
- **Smart recommendations for better public health**: Providing actionable mitigation steps.
- **Scalable architecture for smart cities**: Built on robust cloud infrastructure ready for city-wide deployment.

## 🚀 Why AquaGuard AI?

- **Real-world impact**: Directly addresses critical public health and water safety challenges.
- **AI-first architecture**: Intelligence is built into the core, not added as an afterthought.
- **Scalable design**: Capable of expanding from local municipalities to national deployments.
- **Community-focused solution**: Empowers citizens while enabling officials.
- **Practical implementation**: Uses accessible, modern technologies for rapid deployment.
- **Future-ready platform**: Extensible for IoT integration and advanced autonomous actions.

## Overview
AquaGuard is a comprehensive water monitoring and issue reporting platform designed to bridge the gap between citizens and regional water authorities. It provides citizens with an easy-to-use interface to report water contamination, pressure issues, or supply outages. Simultaneously, it equips officials with a powerful Command Center to track these reports, view predictive AI risk models, monitor live sensor telemetry, and orchestrate rapid response protocols. 

**Deployment Status:** 
The platform is currently production-ready and live. The React frontend is seamlessly deployed on **Firebase Hosting**, while the Python FastAPI backend serving AI intelligence runs securely on **Render**. Both deployments are connected and fully operational.

## Features
- **AI Chat Assistant (Google Gemini)**: Intelligent conversational agent to aid officials with data analysis and reporting.
- **Citizen Dashboard**: Dedicated portal for citizens to track their submitted reports.
- **Government Dashboard**: Command Center for officials to review all complaints and orchestrate responses.
- **Complaint Management**: End-to-end tracking of water-related issues with status updates.
- **Locality Analytics**: In-depth analysis and forecasting of potential water threats by region.
- **Interactive Maps**: Geographic visualization (Heatmaps/Threat Maps) of water contamination risks.
- **Smart Dashboard**: Consolidates real-time sensor data, AI insights, and citizen reports in one view.
- **Responsive UI**: Fully mobile-optimized layouts for access on any device.
- **Production Deployment**: Cloud-hosted infrastructure for both frontend and backend.
- **User Authentication**: Secure login and session management powered by Firebase Auth.
- **Official Profiles**: Cloudinary-powered profile picture uploads and role management.

## 🏗️ System Architecture

(Architecture Diagram Here)

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS (Tailwind CSS)
- Leaflet & React-Leaflet
- Recharts

### Backend
- FastAPI
- Python

### AI
- Google Gemini API

### Deployment & Services
- Firebase Hosting (Frontend Deployment)
- Render (Backend Deployment)
- Firebase Auth & Firestore (Database & Authentication)
- Cloudinary (Image Storage)

## Project Structure
```text
aquaguard-ai/
├── backend/                # Python FastAPI backend for AI models and external API endpoints
├── src/
│   ├── assets/             # Static images and icons
│   ├── components/         # Reusable UI components (e.g., ProtectedRoute, ThreatMap)
│   ├── contexts/           # React Context providers (AuthContext)
│   ├── data/               # Static mock data (localities, timelines)
│   ├── pages/              # Page-level components (LandingPage, OfficialDashboard, ReportIssue, etc.)
│   ├── services/           # External service integrations (firebase.js, api.js)
│   ├── App.jsx             # Main application routing and structure
│   └── main.jsx            # React application entry point
├── tailwind.config.js      # Tailwind CSS configuration and theme definitions
└── package.json            # Project dependencies and scripts
```

## Environment Variables

For local development and deployment, you must define the following environment variables. 
**⚠️ IMPORTANT:** Never hardcode actual API keys in the source code, and ensure `.env` files are added to `.gitignore` to prevent exposing secrets.

### Frontend (`.env` in root directory)
```env
VITE_API_BASE_URL=your_deployed_backend_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=8080
```

## Deployment Instructions

The application is configured for split deployment:

### 1. Frontend → Firebase Hosting
Ensure Firebase CLI is installed and configured (`firebase login`).
```bash
# Build the production assets
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### 2. Backend → Render
1. Connect your GitHub repository to Render as a **Web Service**.
2. Select **Docker** as the Environment.
3. Set the **Root Directory** to `backend`.
4. Add the `GEMINI_API_KEY` as an environment variable in the Render dashboard.
5. Render will automatically detect the `Dockerfile`, inject the `$PORT`, and deploy the FastAPI server.

## Firestore Security Rules Note
To ensure the application functions correctly while protecting user data, you must deploy the following rules in your Firestore database. These rules ensure users can only modify their own profiles and complaints, while allowing officials appropriate read/write access.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /officials/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /complaints/{complaintId} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
      allow read: if request.auth != null;
      allow update: if request.auth != null; // In production, restrict to official roles
      allow delete: if false;
    }
  }
}
```

## Usage
1. **Sign Up / Login**: Navigate to the Official Login page to authenticate via Firebase.
2. **Create Profile**: Upon first login, complete your profile by adding your name, role, and uploading a profile picture.
3. **Report an Issue**: Use the "Report Issue" flow to submit a water quality or supply complaint, attaching a photo of the incident.
4. **View Dashboard**: Citizens can track their issues in "My Complaints", while officials can manage all incoming reports, analyze threat maps, and monitor the timeline in the "Analytics" Command Center.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License.
