
#!/bin/bash

# =======================================================
# YemenJPT Sovereign Platform - Native AI Deploy Script
# Target: Ubuntu 24.04 LTS
# Install Path: /opt/yemenjpt/
# Architecture: Native Ollama + Dockerized Microservices
# Storage: Localhost (S3 Disabled by default)
# =======================================================

set -e

# Visual Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/opt/yemenjpt"

echo -e "${BLUE}██╗   ██╗███████╗███╗   ███╗███████╗███╗   ██╗     ██╗██████╗ ███████╗${NC}"
echo -e "${BLUE}╚██╗ ██╔╝██╔════╝████╗ ████║██╔════╝████╗  ██║     ██║██╔══██╗╚══███╔╝${NC}"
echo -e "${BLUE} ╚████╔╝ █████╗  ██╔████╔██║█████╗  ██╔██╗ ██║     ██║██████╔╝  ███╔╝ ${NC}"
echo -e "${BLUE}  ╚██╔╝  ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██   ██║██╔═══╝  ███╔╝  ${NC}"
echo -e "${BLUE}   ██║   ███████╗██║ ╚═╝ ██║███████╗██║ ╚████║╚█████╔╝██║     ███████╗${NC}"
echo -e "${BLUE}   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚════╝ ╚═╝     ╚══════╝${NC}"
echo -e "${GREEN}>>> SOVEREIGN LOCALHOST DEPLOYMENT (NO S3) >>> /opt/yemenjpt/${NC}"

# 1. ROOT CHECK
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Error: Please run as root (sudo ./deploy.sh)${NC}"
  exit 1
fi

# 2. DIRECTORY ENFORCEMENT / RELOCATION
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" != "$INSTALL_DIR" ]]; then
    echo -e "${YELLOW}[!] Current directory is $CURRENT_DIR. Relocating to $INSTALL_DIR...${NC}"
    mkdir -p "$INSTALL_DIR"
    echo "Copying files..."
    cp -Ra . "$INSTALL_DIR/"
    chmod +x "$INSTALL_DIR/deploy.sh"
    echo -e "${GREEN}Files migrated. Switching context to $INSTALL_DIR${NC}"
    cd "$INSTALL_DIR"
    exec ./deploy.sh
    exit 0
fi

echo -e "${GREEN}✓ Running from correct location: $INSTALL_DIR${NC}"

# 3. SYSTEM UPDATES & PREP
echo -e "${YELLOW}[1/8] Updating System & Installing Base Dependencies...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y curl git jq build-essential libmagic1 ffmpeg ca-certificates gnupg lsb-release apache2-utils ufw

# 4. SCAFFOLDING & STRUCTURE
echo -e "${YELLOW}[2/8] Scaffolding Project Structure...${NC}"
mkdir -p backend/data nlp-engine legal-meter voice-legacy forensics-service uploads shared-uploads db_data qdrant_data minio_data n8n_data neo4j_data ghost_data models/lora

# Generate Backend Dockerfile
if [ ! -f "backend/Dockerfile" ]; then
    echo "Creating backend/Dockerfile..."
    cat <<EOF > backend/Dockerfile
FROM python:3.11-slim
RUN apt-get update && apt-get install -y build-essential libmagic1 ffmpeg curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
ENV PYTHONPATH=/app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF
fi

# Generate Frontend Dockerfile (Vite + Nginx)
if [ ! -f "Dockerfile" ]; then
    echo "Creating Dockerfile (Frontend)..."
    cat <<EOF > Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
fi

# Generate Nginx Config for SPA
if [ ! -f "nginx.conf" ]; then
    echo "Creating nginx.conf..."
    cat <<EOF > nginx.conf
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
fi

# Scaffold microservice main.py
for service in voice-legacy forensics-service nlp-engine legal-meter; do
    if [ ! -f "$service/main.py" ]; then
        echo "Creating default main.py for $service..."
        cat <<EOF > $service/main.py
from fastapi import FastAPI
app = FastAPI(title="YemenJPT $service")
@app.get("/")
def read_root(): return {"status": "online", "service": "$service"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0")
EOF
    fi
done

# 5. PORT CONFLICT RESOLUTION
echo -e "${YELLOW}[3/8] Freeing up ports...${NC}"
systemctl stop apache2 || true
systemctl disable apache2 || true
systemctl stop nginx || true
systemctl disable nginx || true

# 6. DOCKER INSTALLATION
echo -e "${YELLOW}[4/8] Installing Docker Engine...${NC}"
if ! command -v docker &> /dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

# 7. NATIVE OLLAMA INSTALLATION (ALWAYS)
echo -e "${YELLOW}[5/8] Installing Native Ollama (System Service)...${NC}"
# Always run install script to ensure latest version or install if missing
curl -fsSL https://ollama.com/install.sh | sh

# Ensure service is running
echo "Restarting Ollama service..."
systemctl daemon-reload
systemctl enable ollama
systemctl restart ollama

# 8. CONFIGURATION & SECRETS (Localhost Mode)
echo -e "${YELLOW}[6/8] Generating Sovereign Secrets...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    JWT_SECRET=$(openssl rand -hex 32)
    DB_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    N8N_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    MASTER_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9')
    SERVER_IP=$(curl -s https://api.ipify.org || echo "localhost")

    # Force Localhost configs
    sed -i "s/JWT_SECRET=/JWT_SECRET=${JWT_SECRET}/" .env
    sed -i "s/DB_PASSWORD=/DB_PASSWORD=${DB_PASS}/" .env
    sed -i "s/N8N_PASSWORD=/N8N_PASSWORD=${N8N_PASS}/" .env
    sed -i "s/MASTER_PASSWORD=/MASTER_PASSWORD=${MASTER_PASS}/" .env
    
    # Disable S3 by default for local deployment
    echo "ENABLE_S3=false" >> .env
    echo "API_BASE_URL=http://localhost:8000" >> .env
    
    echo -e "${GREEN}Secrets generated. S3 Disabled (Local Storage Active).${NC}"
else
    echo ".env exists. Skipping generation."
fi

# 9. FIREWALL (UFW)
echo -e "${YELLOW}[7/8] Configuring Local Firewall...${NC}"
ufw allow 22/tcp
ufw allow 3000/tcp  # Frontend
ufw allow 8000/tcp  # Backend
ufw allow 8001/tcp
ufw allow 8002/tcp
ufw allow 8003/tcp
ufw allow 8080/tcp
ufw allow 8081/tcp
# ufw allow 9000/tcp # MinIO Disabled temporarily
# ufw allow 9001/tcp
ufw allow 5678/tcp
ufw allow 6333/tcp
ufw allow 7474/tcp
ufw allow 2368/tcp
ufw allow 11434/tcp # Native Ollama
ufw --force enable

# 10. BUILD & LAUNCH SERVICES
echo -e "${YELLOW}[8/8] Building Microservices Stack...${NC}"
# Stop any existing containers to free up resources/ports
docker compose down --remove-orphans || true
docker compose up -d --build

# 11. MODEL PROVISIONING (NATIVE)
echo -e "${YELLOW}[+] Provisioning AI Models via Native Ollama...${NC}"
sleep 5 # Wait for Ollama service to fully init

# Ensure Modelfile exists
if [ ! -f "backend/data/Modelfile.YemenJPT" ]; then
    echo "Creating Default YemenJPT Modelfile..."
    cat <<EOF > backend/data/Modelfile.YemenJPT
FROM llama3
SYSTEM "You are YemenJPT, a sovereign AI assistant. You adhere to strict ethical guidelines: No hate speech, no deepfakes, and prioritize data sovereignty."
PARAMETER temperature 0.3
EOF
fi

echo "Pulling Base Model (llama3)..."
ollama pull llama3

echo "Creating Custom Model (YemenJPT)..."
ollama create YemenJPT -f backend/data/Modelfile.YemenJPT || echo "Warning: Model creation failed. Check Ollama logs."

SERVER_IP=$(curl -s https://api.ipify.org)

echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}   YEMENJPT SYSTEM IS LIVE (LOCALHOST / NO S3)          ${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "Main Frontend:     http://$SERVER_IP:3000"
echo -e "API Gateway:       http://$SERVER_IP:8000"
echo -e "AI Engine:         http://$SERVER_IP:11434 (Native)"
echo -e "Storage:           Local Disk (/opt/yemenjpt/uploads)"
echo -e "Master User:       admin"
echo -e "Check .env for passwords."
