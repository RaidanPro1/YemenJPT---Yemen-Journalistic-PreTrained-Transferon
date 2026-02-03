
# YemenJPT Sovereign Intelligence Platform
**Version:** 8.0 (Production Release)
**Target:** Ubuntu 24.04 LTS

## 🌐 DNS Requirements (Critical)
Before running the installation, you must configure the following **A Records** in your DNS provider (e.g., Cloudflare, Namecheap) to point to your server's IP address:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | **ai** | `YOUR_SERVER_IP` | DNS Only (Recommended for Let's Encrypt) |
| A | **files** | `YOUR_SERVER_IP` | DNS Only |
| A | **automation** | `YOUR_SERVER_IP` | DNS Only |

*Resulting Domains:*
*   `ai.ph-ye.org` (Main App & API)
*   `files.ai.ph-ye.org` (Secure Storage)
*   `automation.ai.ph-ye.org` (Workflows)

## 🏗️ Architecture
This stack is designed for **Data Sovereignty**. No data leaves the server unless explicitly configured.

*   **Gateway:** Traefik (Auto SSL Management).
*   **AI:** Ollama (Native & Containerized Hybrid).
*   **Backend:** FastAPI (Python 3.11).
*   **Frontend:** React + Vite (Served via Nginx Alpine).
*   **Data:** PostgreSQL + Qdrant (Vector) + MinIO (Object Storage).

## 🚀 Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-repo/yemenjpt.git
    cd yemenjpt
    ```

2.  **Run the Installer:**
    ```bash
    chmod +x deploy.sh
    sudo ./deploy.sh
    ```

    *The script will automatically:*
    *   Update Ubuntu & Install Docker.
    *   Install Ollama Native.
    *   Generate secure passwords in `.env`.
    *   Build and launch the platform.

3.  **Access:**
    *   Open `https://ai.ph-ye.org`.
    *   Login with user: `admin`.
    *   Password: See the `.env` file generated on the server (`cat .env`).

## 🛠️ Maintenance

**Restart Services:**
```bash
docker compose restart
```

**View Logs:**
```bash
docker compose logs -f backend
```

**Update AI Model:**
```bash
docker compose exec ollama ollama pull llama3
```
