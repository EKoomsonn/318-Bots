# 🩸 RedApp — Real-Time Blood Donation Coordination Platform
> **Course:** DCIT 318 — Programming II (C#) · University of Ghana  
> **Team Roster:** 8 Members (Project Lead: Obeng Nana Yaw Asante)

---

## 📌 Overview

**RedApp** solves the persistent blood shortage crisis in hospitals across Ghana and sub-Saharan Africa. Rather than unstructured phone calls and panic appeals on social media, RedApp provides an automated, real-time coordination bridge connecting hospital emergency wards directly to nearby, biologically compatible blood donors within minutes.

### 🌟 Core Capabilities
1. **Urgent Request Broadcasting**: Hospitals post live blood needs; WebSockets/SignalR push alerts instantly to compatible donors without page refreshes.
2. **Biological Compatibility Engine**: Clinical ABO & Rh factor rule engine (Universal Donor: `O-`, Universal Recipient: `AB+`).
3. **Proximity Filtering**: Haversine great-circle distance ranking (closest donors surfaced first).
4. **Donor Scheduling**: Donors pledge and select appointment arrival slots.
5. **Privacy Masking**: Contact numbers remain masked (`+233 24 *** *233`) to ensure confidentiality.
6. **Live Ghana Map**: Real-time Leaflet/OpenStreetMap coordinates for Korle Bu, Ridge, 37 Military Hospital, etc.

---

## 📁 Repository Structure

```
RedApp/
├── frontend/                     # React (Vite) + Tailwind CSS + Leaflet (READY FOR NETLIFY)
│   ├── dist/                     # Pre-built production static assets (instant Netlify drop)
│   ├── public/_redirects         # Netlify SPA routing rules (/* /index.html 200)
│   ├── netlify.toml              # Netlify build configuration
│   ├── src/                      # UI components, contexts, and biological engines
│   └── .env.example              # VITE_API_URL configuration
│
├── backend/                      # Node.js + Express + Socket.IO (READY FOR RENDER / RAILWAY)
│   ├── src/
│   │   ├── engine/               # Compatibility & Haversine proximity engines
│   │   ├── models/               # Seed data for Ghana hospitals & donors
│   │   ├── routes/               # REST API endpoints
│   │   ├── socket/               # Real-time WebSocket handlers
│   │   └── server.js             # HTTP & Socket.IO server
│   ├── test/                     # 33 passing automated test suites
│   ├── render.yaml               # 1-Click Render.com deployment blueprint
│   ├── Dockerfile                # Container deployment for Railway / Fly.io
│   └── Procfile                  # Web process definition
│
└── backend-dotnet/               # C# ASP.NET Core 8 Web API + SignalR (DCIT 318 Course Spec)
    ├── Controllers/              # BloodRequestsController.cs & DonorsController.cs
    ├── Hubs/                     # BloodAlertHub.cs (SignalR)
    ├── Models/                   # C# domain models (BloodRequest, Donor, Hospital)
    ├── Services/                 # CompatibilityEngine.cs & ProximityService.cs
    ├── Program.cs                # ASP.NET Core entrypoint with SignalR & CORS
    └── RedApp.Api.csproj
```

---

## 🚀 How to Run Locally in VS Code

### 1. Open the project in VS Code
Run in your terminal or PowerShell:
```bash
code "C:\Users\Administrator\Desktop\RedApp"
```

### 2. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:5000`. You can visit `http://localhost:5000/api/health` to verify.

### 3. Start the Frontend (Port 5173)
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🌐 How to Deploy Frontend to Netlify

You can deploy the frontend in two ways:

### Option A: 1-Minute Netlify Drop (Fastest — No Git required)
1. Log in to [Netlify](https://app.netlify.com).
2. Go to **Sites** $\rightarrow$ scroll to **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"**.
3. Drag and drop the `frontend/dist` folder into Netlify.
4. Your site is instantly live with a custom `.netlify.app` URL!

### Option B: Netlify via GitHub Repository (Continuous Deployment)
1. Push your `RedApp` folder to a GitHub repository.
2. In Netlify, click **"Add new site"** $\rightarrow$ **"Import an existing project"** $\rightarrow$ select **GitHub**.
3. Set the build configuration:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Under **Environment variables**, add:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
5. Click **Deploy Site**.

---

## ☁️ Where and How to Deploy the Backend

We strongly recommend **Render.com** (Top Choice) or **Railway.app**:

### Recommended: Deploy on Render.com (Free Tier)
1. Push the project to GitHub.
2. Sign up at [Render.com](https://render.com).
3. Click **New +** $\rightarrow$ **Web Service** $\rightarrow$ connect your GitHub repository.
4. Configure the service:
   - **Name:** `redapp-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-site.netlify.app`
6. Click **Create Web Service**. Render will generate a URL like `https://redapp-backend.onrender.com`.
7. Paste this URL into your Netlify `VITE_API_URL` environment variable!

### Alternative: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app) $\rightarrow$ **New Project** $\rightarrow$ **Deploy from GitHub repo**.
2. Select your repository, set the directory to `backend`, and click Deploy.

---

## 🧪 Running Automated Unit Tests

In the `backend` directory, run:
```bash
npm test
```
This runs 33 test cases validating:
- Universal Donor (`O-`) compatibility against all 8 blood groups
- Universal Recipient (`AB+`) compatibility from all 8 blood groups
- Incompatibility guardrails (e.g. `A+` cannot donate to `O-`)
- Haversine great-circle distance calculations between Accra hospitals
- Proximity ranking algorithm
- Emergency request creation and scheduling workflows

---

## 👥 DCIT 318 Team Roster

| Member Name | Student ID | Project Role |
| :--- | :--- | :--- |
| **Obeng Nana Yaw Asante** | 22120929 | Project Lead |
| **Nasir Kwaku Anyobode** | 22060865 | Backend Dev (C# / API) |
| **Elton Koomson** | 22053775 | Backend Dev (C# / API) |
| **Mark Ashong Katai Handsome** | 22112890 | Frontend Dev |
| **Joseph Donkor** | 22128961 | Frontend Dev |
| **Michael Chandi Thomas** | 22241883 | Matching Engine Dev |
| **Aseda Kwame Herman** | 22060793 | QA & Testing |
| **Brian Danso-Wontumi** | 22242270 | Documentation & QA |
