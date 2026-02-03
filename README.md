
# YemenJPT Sovereign Intelligence Platform
**Version:** 9.5 (Hybrid Cloud Strategy)
**Target:** Ubuntu 24.04 LTS (Backend) + Vercel (Frontend)
**Install Path:** `/opt/yemenjpt/`
**Repository:** [YemenJPT](https://github.com/RaidanPro1/YemenJPT---Yemen-Journalistic-PreTrained-Transferon)

## 🏗️ System Architecture (Hybrid)
YemenJPT uses a **Hybrid Sovereign Architecture** to combine global accessibility with data privacy.

| Component | Host | Technology | Reason |
|-----------|------|------------|--------|
| **Frontend** | **Vercel** | React (Vite) | High speed, DDoS protection, Global CDN. |
| **Backend** | **VPS (Ubuntu)** | FastAPI, Docker | Heavy AI processing (Ollama), GPU access, Data Sovereignty. |
| **Database** | **VPS (Ubuntu)** | PostgreSQL, MinIO | Strict data residency compliance (Data stays in Yemen/Private VPS). |

---

## ☁️ Vercel Deployment Guide (Frontend Only)

Since Vercel cannot run Docker or Heavy AI models, we connect the Vercel Frontend to your Sovereign Backend.

### Prerequisites
1.  Ensure your Backend is live on your VPS (e.g., `https://api.ph-ye.org`).
2.  Ensure you have a Vercel account.

### Step 1: Push to GitHub
Upload only the frontend code or the full repo to GitHub.

### Step 2: Import to Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/new).
2.  Import the `YemenJPT` repository.
3.  **Build Settings:**
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`

### Step 3: Connect to Backend
The `vercel.json` file is already configured to proxy API calls.
*   Requests to `your-app.vercel.app/api/*` will automatically be routed to `https://api.ph-ye.org/api/*`.
*   **Important:** If your backend domain is different, update the `destination` URL in `vercel.json` before deploying.

---

## 🚀 VPS Installation Guide (Backend Core)

This sets up the heavy machinery (AI, DB, API) on your private server.

### Prerequisites
*   **OS:** Ubuntu 24.04 LTS.
*   **Hardware:** 4 CPU Cores, 16GB RAM (Minimum).
*   **Domain:** `ph-ye.org` (Managed via Cloudflare).

### Deployment
The `deploy.sh` script handles everything:

1.  **Clone & Run:**
    ```bash
    git clone https://github.com/RaidanPro1/YemenJPT---Yemen-Journalistic-PreTrained-Transferon.git
    chmod +x deploy.sh
    sudo ./deploy.sh
    ```
    *The script will enforce installation in `/opt/yemenjpt/`, setup Docker, Nginx/Traefik, and configure DNS.*

### verification
*   **API Health:** Visit `https://api.ph-ye.org/docs` to ensure the backend is running.
*   **Gateway:** Check `https://control.ph-ye.org` (Traefik Dashboard).

## 🛡️ Security Note
*   **CORS:** Ensure your FastAPI backend (`main.py`) allows the Vercel domain in `allow_origins`.
*   **Sovereignty:** Even though the frontend is on Vercel, **NO DATA** is stored there. All audio, text, and images are processed and stored solely on your VPS.
