
# YemenJPT Sovereign Intelligence Platform
**Version:** 9.8 (Native AI + Local Storage)
**Target:** Ubuntu 24.04 LTS
**Install Path:** `/opt/yemenjpt/`
**Architecture:** Native Ollama + Docker Microservices

## 🏗️ System Architecture
This version runs microservices in Docker but keeps the AI Engine (Ollama) **Native** on the host OS.
**Storage Update:** S3 (MinIO) dependency is temporarily disabled. All files are stored securely on the local disk (`/opt/yemenjpt/uploads`).

### Service Port Mapping
| Service | Local URL | Description |
|---------|-----------|-------------|
| **Frontend** | `http://localhost:3000` | Main User Interface |
| **API Backend** | `http://localhost:8000` | Core Logic & Router |
| **AI Engine** | `http://localhost:11434` | **Native Ollama (Host)** |
| **Storage** | `/opt/yemenjpt/uploads` | **Local Disk (No S3)** |
| **NLP Engine** | `http://localhost:8001` | Sentiment & Entity Extraction |
| **Legal Meter** | `http://localhost:8002` | Constitutional Compliance |
| **Voice Engine** | `http://localhost:8003` | Audio Processing |
| **Forensics** | `http://localhost:8080` | Image Analysis |
| **Qdrant** | `http://localhost:6333` | Vector Database |

---

## 🚀 Installation Guide

### Prerequisites
*   **OS:** Ubuntu 24.04 LTS.
*   **Hardware:** 4 CPU Cores, 16GB RAM (Minimum).
*   **Network:** Ports listed above must be open.

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
    *The script will move files to `/opt/yemenjpt/`, install Native Ollama, configure Local Storage, and start Docker services.*

### Step 2: Access
Open your browser and navigate to `http://YOUR_SERVER_IP:3000`.

*   **Default User:** `admin`
*   **Default Password:** Check the `.env` file generated in `/opt/yemenjpt/`.

## 🧠 AI Management (Native)
Since Ollama is running natively, you can interact with it directly from the terminal:

**Check Status:**
```bash
systemctl status ollama
```

**Run Model Manually:**
```bash
ollama run YemenJPT "كيف حالك؟"
```
