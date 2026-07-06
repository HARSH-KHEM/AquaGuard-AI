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
| **Madhu Sri Somu** | AI Research & Model Development |
| **Zainab Rizvi** | Frontend & UI/UX Developer |
| **Adiba Ansari** | Backend Development • Documentation & Testing |

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

## Features
- **User Authentication**: Secure login and session management powered by Firebase Auth.
- **Official Profiles**: Ability for water authority personnel to create and edit profiles, including Cloudinary-powered profile picture uploads.
- **Citizen Issue Reporting**: Streamlined form for users to report water-related issues with optional photo evidence.
- **Complaint Tracking**: Dedicated dashboard for citizens to track the status (Pending, In Progress, Resolved) of their submitted reports.
- **Command Center Dashboard**: Advanced interface for officials to review all citizen complaints, monitor interactive disease outbreak timelines, and analyze real-time sensor data.
- **Interactive Threat Map**: Geographic visualization of water contamination risks across different localities using Leaflet.
- **Route Protection**: Secure authenticated routing ensuring only authorized users can access sensitive official dashboards.

## Tech Stack
| Technology | Purpose |
| :--- | :--- |
| **React 19 + Vite** | High-performance frontend framework and build tool |
| **Tailwind CSS** | Utility-first styling for a responsive, modern UI design |
| **React Router DOM** | Client-side routing for seamless single-page application navigation |
| **Firebase Auth & Firestore** | Secure authentication and real-time NoSQL database for data persistence |
| **Cloudinary** | Unsigned image uploads for handling complaint photos and user avatars |
| **Recharts** | Data visualization for interactive timelines and risk charts |
| **Leaflet & React-Leaflet** | Interactive geographic threat mapping |
| **Lucide React** | Consistent, crisp iconography across the application |

## Project Structure
```text
aquaguard-ai/
├── backend/                # Python backend for AI models and external API endpoints
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

## Installation & Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- git

### 1. Clone the repository
```bash
git clone https://github.com/HARSH-KHEM/AquaGuard-AI.git
cd AquaGuard-AI/aquaguard-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Currently, Firebase and Cloudinary configurations are integrated into the source files. For production environments, it is recommended to extract these into a `.env` file at the root of the `aquaguard-ai` directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```
*(Note: You will need to update `src/services/firebase.js` and the Cloudinary fetch requests to use `import.meta.env` if you transition to environment variables).*

### 4. Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password provider).
3. Enable **Firestore Database**.
4. Deploy the required Firestore Security Rules (see below).

### 5. Cloudinary Setup
1. Create a free [Cloudinary](https://cloudinary.com/) account.
2. Navigate to Settings > Upload and create a new **Unsigned Upload Preset**.

### 6. Run the Application
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 7. Build for Production
```bash
npm run build
```

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
