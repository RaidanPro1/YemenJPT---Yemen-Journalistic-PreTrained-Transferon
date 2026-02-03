
# YemenJPT Sovereign Intelligence Platform
**Version:** 9.6 (Localhost / Ports Edition)
**Target:** Ubuntu 24.04 LTS
**Install Path:** `/opt/yemenjpt/`
**Architecture:** Microservices exposed via Direct Ports

## 🏗️ System Architecture
This version runs entirely on your local server or VPS without requiring a domain name or DNS configuration. All services are exposed on specific ports.

### Service Port Mapping
| Service | Local URL | Description |
|---------|-----------|-------------|
| **Frontend** | `http://localhost:3000` | Main User Interface |
| **API Backend** | `http://localhost:8000` | Core Logic & Router |
| **NLP Engine** | `http://localhost:8001` | Sentiment & Entity Extraction |
| **Legal Meter** | `http://localhost:8002` | Constitutional Compliance |
| **Voice Engine** | `http://localhost:8003` | Audio Processing |
| **Forensics** | `http://localhost:8080` | Image Analysis |
| **MinIO Console** | `http://localhost:9001` | S3 Storage Manager |
| **MinIO API** | `http://localhost:9000` | S3 API Endpoint |
| **n8n** | `http://localhost:5678` | Workflow Automation |
| **Qdrant** | `http://localhost:6333` | Vector Database |
| **Neo4j** | `http://localhost:7474` | Knowledge Graph |
| **Adminer** | `http://localhost:8081` | Database GUI (Postgres) |
| **Ghost** | `http://localhost:2368` | News CMS |

---

## 🚀 Installation Guide

### Prerequisites
*   **OS:** Ubuntu 24.04 LTS.
*   **Hardware:** 4 CPU Cores, 16GB RAM (Minimum).
*   **Network:** Ports listed above must be open (Deploy script handles UFW).

### Step 1: Deploy
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/RaidanPro1/YemenJPT---Yemen-Journalistic-PreTrained-Transferon.git
    cd YemenJPT---Yemen-Journalistic-PreTrained-Transferon
    ```

2.  **Run the Installer:**
    ```bash
    chmod +x deploy.sh
    sudo ./deploy.sh
    ```
    *The script will move files to `/opt/yemenjpt/`, install Docker, build containers, and expose ports.*

### Step 2: Access
Open your browser and navigate to `http://YOUR_SERVER_IP:3000`.

*   **Default User:** `admin`
*   **Default Password:** Check the `.env` file generated in `/opt/yemenjpt/`.

## 🔧 Maintenance

**View Logs:**
```bash
cd /opt/yemenjpt
docker compose logs -f backend
```

**Restart Services:**
```bash
docker compose restart
```

**Stop System:**
```bash
docker compose down
```
