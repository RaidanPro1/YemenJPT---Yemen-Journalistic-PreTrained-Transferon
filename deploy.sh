
#!/bin/bash

# =======================================================
# YemenJPT Sovereign Platform - Master Deploy Script
# Target: Ubuntu 24.04 LTS
# Install Path: /opt/yemenjpt/
# Domain: *.ph-ye.org
# Cloudflare Zone ID: 9b9834581bbbe346420c570113de0087
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
CF_TOKEN="o9e6x3TRENSogHOBQ5AYpKFXzXnhbPY2Ztqw3IKG"
CF_ZONE_ID="9b9834581bbbe346420c570113de0087"
DOMAIN_ROOT="ph-ye.org"

echo -e "${BLUE}██╗   ██╗███████╗███╗   ███╗███████╗███╗   ██╗     ██╗██████╗ ███████╗${NC}"
echo -e "${BLUE}╚██╗ ██╔╝██╔════╝████╗ ████║██╔════╝████╗  ██║     ██║██╔══██╗╚══███╔╝${NC}"
echo -e "${BLUE} ╚████╔╝ █████╗  ██╔████╔██║█████╗  ██╔██╗ ██║     ██║██████╔╝  ███╔╝ ${NC}"
echo -e "${BLUE}  ╚██╔╝  ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██   ██║██╔═══╝  ███╔╝  ${NC}"
echo -e "${BLUE}   ██║   ███████╗██║ ╚═╝ ██║███████╗██║ ╚████║╚█████╔╝██║     ███████╗${NC}"
echo -e "${BLUE}   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚════╝ ╚═╝     ╚══════╝${NC}"
echo -e "${GREEN}>>> SOVEREIGN MICROSERVICES DEPLOYMENT >>> /opt/yemenjpt/${NC}"

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
echo -e "${YELLOW}[1/10] Updating System & Installing Base Dependencies...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y curl git jq build-essential libmagic1 ffmpeg ca-certificates gnupg lsb-release apache2-utils ufw

# 4. SCAFFOLDING & STRUCTURE
echo -e "${YELLOW}[2/10] Scaffolding Project Structure & Missing Files...${NC}"
mkdir -p backend/data nlp-engine legal-meter voice-legacy forensics-service uploads shared-uploads db_data qdrant_data minio_data n8n_data neo4j_data ghost_data models/lora

# Generate Backend Dockerfile (Python Shared Image)
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

# Scaffold missing microservice main.py files
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
echo -e "${YELLOW}[3/10] Checking for port conflicts (80/443)...${NC}"
if systemctl is-active --quiet apache2; then systemctl stop apache2; systemctl disable apache2; fi
if systemctl is-active --quiet nginx; then systemctl stop nginx; systemctl disable nginx; fi

# 6. NATIVE OLLAMA INSTALLATION
echo -e "${YELLOW}[4/10] Installing Ollama (Native Host Mode)...${NC}"
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
fi

# 7. DOCKER INSTALLATION
echo -e "${YELLOW}[5/10] Installing Docker Engine...${NC}"
if ! command -v docker &> /dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

# 8. CONFIGURATION & SECRETS
echo -e "${YELLOW}[6/10] Generating Sovereign Secrets...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    JWT_SECRET=$(openssl rand -hex 32)
    DB_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    MINIO_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    N8N_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    MASTER_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9')
    TRAEFIK_HASH=$(htpasswd -nb admin "$MASTER_PASS" | sed -e 's/\$/\$\$/g')

    sed -i "s/JWT_SECRET=/JWT_SECRET=${JWT_SECRET}/" .env
    sed -i "s/DB_PASSWORD=/DB_PASSWORD=${DB_PASS}/" .env
    sed -i "s/MINIO_ROOT_PASSWORD=/MINIO_ROOT_PASSWORD=${MINIO_PASS}/" .env
    sed -i "s/N8N_PASSWORD=/N8N_PASSWORD=${N8N_PASS}/" .env
    sed -i "s/MASTER_PASSWORD=/MASTER_PASSWORD=${MASTER_PASS}/" .env
    sed -i "s|TRAEFIK_BASIC_AUTH=|TRAEFIK_BASIC_AUTH=${TRAEFIK_HASH}|" .env
    
    echo -e "${GREEN}Secrets generated. MASTER PASSWORD: ${MASTER_PASS}${NC}"
else
    echo ".env exists. Skipping generation."
fi

# 9. FIREWALL (UFW)
echo -e "${YELLOW}[7/10] Configuring Firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 5432/tcp
ufw deny 6333/tcp
ufw deny 9000/tcp
ufw deny 5678/tcp
ufw deny 7474/tcp
ufw deny 2368/tcp
ufw deny 8000/tcp
ufw deny 8001/tcp
ufw deny 8002/tcp
ufw deny 8003/tcp
ufw deny 8080/tcp
ufw --force enable

# 10. CLOUDFLARE DNS SETUP
echo -e "${YELLOW}[8/10] Configuring Cloudflare DNS Records...${NC}"
SERVER_IP=$(curl -s https://api.ipify.org)
echo "Detected Server IP: $SERVER_IP"
SUBDOMAINS=("ai" "api" "radar" "meter" "voice" "scan" "vault" "studio" "vector" "db" "graph" "news" "control")

for sub in "${SUBDOMAINS[@]}"; do
    echo "Updating DNS for: $sub.$DOMAIN_ROOT"
    
    # Check if record exists
    RECORD_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?type=A&name=$sub.$DOMAIN_ROOT" \
        -H "Authorization: Bearer $CF_TOKEN" \
        -H "Content-Type: application/json" | jq -r '.result[0].id')
    
    if [ "$RECORD_ID" != "null" ]; then
        # Update existing
        curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$RECORD_ID" \
            -H "Authorization: Bearer $CF_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{"type":"A","name":"'"$sub"'","content":"'"$SERVER_IP"'","ttl":1,"proxied":false}' > /dev/null
    else
        # Create new
        curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records" \
            -H "Authorization: Bearer $CF_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{"type":"A","name":"'"$sub"'","content":"'"$SERVER_IP"'","ttl":1,"proxied":false}' > /dev/null
    fi
done
echo -e "${GREEN}DNS Records Updated.${NC}"

# 11. BUILD & LAUNCH
echo -e "${YELLOW}[9/10] Building Microservices Stack...${NC}"
docker compose down --remove-orphans || true
docker compose up -d --build

# 12. MODEL PROVISIONING
echo -e "${YELLOW}[10/10] Provisioning AI Models...${NC}"
sleep 10
if [ ! -f "backend/data/Modelfile.YemenJPT" ]; then
    echo "Creating Default YemenJPT Modelfile..."
    cat <<EOF > backend/data/Modelfile.YemenJPT
FROM llama3
SYSTEM "You are YemenJPT, a sovereign AI assistant. You adhere to strict ethical guidelines: No hate speech, no deepfakes, and prioritize data sovereignty."
PARAMETER temperature 0.3
EOF
fi
docker compose exec -T ollama ollama pull llama3
docker compose exec -T ollama ollama create YemenJPT -f /root/.ollama/Modelfile.YemenJPT || \
docker compose exec -T ollama ollama create YemenJPT -f /app/backend/data/Modelfile.YemenJPT || \
echo "Model creation skipped (manual intervention may be required)."

echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}   YEMENJPT SOVEREIGN PLATFORM INSTALLED SUCCESSFULLY   ${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "Main App:          https://ai.ph-ye.org"
echo -e "Admin Control:     https://control.ph-ye.org"
echo -e "Master User:       admin"
echo -e "Check .env for passwords."
