
# YemenJPT Sovereign Intelligence Platform
**Version:** 9.4 (Stable Architecture)
**Target:** Ubuntu 24.04 LTS
**Install Path:** `/opt/yemenjpt/`
**Repository:** [YemenJPT](https://github.com/RaidanPro1/YemenJPT---Yemen-Journalistic-PreTrained-Transferon)

## 🏗️ System Architecture
YemenJPT follows a **Microservices Architecture** designed for data sovereignty, utilizing local AI inference and self-hosted infrastructure.

### Core Components
| Service | Domain | Technology | Description |
|---------|--------|------------|-------------|
| **Gateway** | `control.ph-ye.org` | **Traefik** | Reverse Proxy, Load Balancer, and Auto-SSL (Let's Encrypt). |
| **Frontend** | `ai.ph-ye.org` | **React (Vite)** | The main user interface for journalists and admins. |
| **API Gateway** | `api.ph-ye.org` | **FastAPI** | Central orchestration logic and routing. |
| **AI Engine** | - | **Ollama** | Local LLM inference (Llama3, YemenJPT Custom Model). |

### Specialized Microservices
| Service | Domain | Function |
|---------|--------|----------|
| **NLP Radar** | `radar.ph-ye.org` | Misinformation detection & sentiment analysis. |
| **Legal Meter** | `meter.ph-ye.org` | Constitutional compliance checking (RAG). |
| **Voice Legacy** | `voice.ph-ye.org` | Audio transcription & dialect recognition. |
| **Forensics** | `scan.ph-ye.org` | Image verification (ELA) & Deepfake detection. |

### Data Layer
| Service | Domain | Purpose |
|---------|--------|---------|
| **PostgreSQL** | `db.ph-ye.org` | Relational data & user management. |
| **Qdrant** | `vector.ph-ye.org` | Vector database for RAG & semantic search. |
| **MinIO** | `vault.ph-ye.org` | S3-compatible object storage for archives. |
| **Neo4j** | `graph.ph-ye.org` | Knowledge graph for relationship mapping. |

---

## 🚀 Installation Guide

### Prerequisites
*   **OS:** Ubuntu 24.04 LTS (Clean Install Recommended).
*   **Hardware:** 4 CPU Cores, 16GB RAM (Minimum), 100GB Storage.
*   **Domain:** A Cloudflare-managed domain (e.g., `ph-ye.org`).

### Step 1: Deployment
The `deploy.sh` script handles everything: system updates, dependencies (Docker, Nvidia Container Toolkit), folder structure, file generation, and DNS configuration.

1.  **Clone the Repository (or create the script):**
    ```bash
    git clone https://github.com/RaidanPro1/YemenJPT---Yemen-Journalistic-PreTrained-Transferon.git
    cd YemenJPT---Yemen-Journalistic-PreTrained-Transferon
    ```

2.  **Run the Installer:**
    ```bash
    chmod +x deploy.sh
    sudo ./deploy.sh
    ```
    *The script will automatically move itself to `/opt/yemenjpt/` and continue execution.*

### Step 2: Post-Installation
1.  **Verify Services:**
    Access `https://control.ph-ye.org` (Traefik Dashboard) to ensure all routers are "Success".
    *   **User:** `admin`
    *   **Password:** Check the `.env` file generated in `/opt/yemenjpt/`.

2.  **Access Main App:**
    Go to `https://ai.ph-ye.org`. The frontend should be live.

3.  **Check AI Models:**
    Ensure the `YemenJPT` model is loaded in Ollama:
    ```bash
    docker compose exec ollama ollama list
    ```

## 🔧 Troubleshooting

*   **DNS Issues:** If domains are not resolving, check Cloudflare dashboard. Ensure records are set to `DNS Only` (Grey Cloud) initially to allow Let's Encrypt to issue certificates.
*   **Container Errors:** View logs for a specific service:
    ```bash
    cd /opt/yemenjpt
    docker compose logs -f backend
    ```
*   **Database Access:** Use `https://db.ph-ye.org` to access Adminer.
    *   **Server:** `db` (Internal docker name)
    *   **User:** `raidan_admin` (or check `.env`)
    *   **DB:** `raidan_vault`

## 🛡️ Security Note
This system is designed to be **Sovereign**. 
*   **Firewall:** UFW is enabled by default, blocking all ports except 80, 443, and 22.
*   **Data:** All data resides in `/opt/yemenjpt/` on your server. No external API calls are made for inference.
