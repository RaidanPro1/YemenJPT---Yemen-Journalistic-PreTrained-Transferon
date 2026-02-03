
#!/bin/bash

# =======================================================
# YemenJPT Sovereign Platform - PRO Deployment Script
# Target: Ubuntu 24.04 LTS
# Domain: ai.ph-ye.org
# =======================================================

set -e # Exit immediately if a command exits with a non-zero status

# Visual Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}██╗   ██╗███████╗███╗   ███╗███████╗███╗   ██╗     ██╗██████╗ ███████╗${NC}"
echo -e "${BLUE}╚██╗ ██╔╝██╔════╝████╗ ████║██╔════╝████╗  ██║     ██║██╔══██╗╚══███╔╝${NC}"
echo -e "${BLUE} ╚████╔╝ █████╗  ██╔████╔██║█████╗  ██╔██╗ ██║     ██║██████╔╝  ███╔╝ ${NC}"
echo -e "${BLUE}  ╚██╔╝  ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║██   ██║██╔═══╝  ███╔╝  ${NC}"
echo -e "${BLUE}   ██║   ███████╗██║ ╚═╝ ██║███████╗██║ ╚████║╚█████╔╝██║     ███████╗${NC}"
echo -e "${BLUE}   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚════╝ ╚═╝     ╚══════╝${NC}"
echo -e "${GREEN}>>> SOVEREIGN DEPLOYMENT INITIATED <<<${NC}"

# 1. ROOT CHECK
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Error: Please run as root (sudo ./deploy.sh)${NC}"
  exit 1
fi

# 2. SYSTEM UPDATES & PREP
echo -e "${YELLOW}[1/8] Updating System & Installing Base Dependencies...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y curl git jq build-essential libmagic1 ffmpeg ca-certificates gnupg lsb-release apache2-utils ufw

# 3. PORT CONFLICT RESOLUTION
echo -e "${YELLOW}[2/8] Checking for port conflicts (80/443)...${NC}"
if systemctl is-active --quiet apache2; then
    echo "Stopping Apache2..."
    systemctl stop apache2
    systemctl disable apache2
fi
if systemctl is-active --quiet nginx; then
    echo "Stopping Host Nginx..."
    systemctl stop nginx
    systemctl disable nginx
fi

# 4. NATIVE OLLAMA INSTALLATION
echo -e "${YELLOW}[3/8] Installing Ollama (Native Host Mode)...${NC}"
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
    echo -e "${GREEN}Ollama installed successfully.${NC}"
else
    echo "Ollama is already installed."
fi
# Ensure Ollama service is running on host (default port 11434)
# Note: Docker containers will use their own internal Ollama instance for network isolation,
# but the host instance is useful for CLI debugging.

# 5. DOCKER INSTALLATION
echo -e "${YELLOW}[4/8] Installing Docker Engine...${NC}"
if ! command -v docker &> /dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
    echo "Docker is already installed."
fi

# 6. CONFIGURATION & SECRETS
echo -e "${YELLOW}[5/8] Generating Sovereign Secrets...${NC}"
mkdir -p backend/data uploads shared-uploads db_data qdrant_data minio_data n8n_data models/lora

if [ ! -f .env ]; then
    cp .env.example .env
    
    # Generate Strong Passwords
    JWT_SECRET=$(openssl rand -hex 32)
    DB_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    MINIO_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    N8N_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    MASTER_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9')

    # Inject into .env
    sed -i "s/JWT_SECRET=/JWT_SECRET=${JWT_SECRET}/" .env
    sed -i "s/DB_PASSWORD=/DB_PASSWORD=${DB_PASS}/" .env
    sed -i "s/MINIO_PASSWORD=/MINIO_PASSWORD=${MINIO_PASS}/" .env
    sed -i "s/N8N_PASSWORD=/N8N_PASSWORD=${N8N_PASS}/" .env
    sed -i "s/MASTER_PASSWORD=/MASTER_PASSWORD=${MASTER_PASS}/" .env
    
    echo -e "${GREEN}Secrets generated and saved to .env${NC}"
    echo -e "${RED}IMPORTANT: Master Password: ${MASTER_PASS}${NC}"
else
    echo ".env exists. Skipping generation."
fi

# 7. FIREWALL (UFW)
echo -e "${YELLOW}[6/8] Configuring Firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 5432/tcp  # Block external DB access
ufw deny 6333/tcp  # Block external Vector DB
ufw deny 9000/tcp  # Block direct MinIO (use Traefik domain)
ufw --force enable

# 8. BUILD & LAUNCH
echo -e "${YELLOW}[7/8] Building Containers (This may take a while)...${NC}"
docker compose down --remove-orphans || true
docker compose up -d --build

# 9. MODEL PROVISIONING
echo -e "${YELLOW}[8/8] Provisioning AI Models...${NC}"
echo "Waiting for Ollama container to stabilize..."
sleep 10

# Check if custom modelfile exists
if [ ! -f "backend/data/Modelfile.YemenJPT" ]; then
    echo "Creating Default YemenJPT Modelfile..."
    cat <<EOF > backend/data/Modelfile.YemenJPT
FROM llama3
SYSTEM "You are YemenJPT, a sovereign AI assistant for Yemeni journalists. You adhere to strict ethical guidelines: No hate speech, no deepfakes, verify political claims, and prioritize data sovereignty."
PARAMETER temperature 0.3
EOF
fi

# Execute model creation inside the container
echo "Pulling Llama3 base..."
docker compose exec -T ollama ollama pull llama3
echo "Creating YemenJPT..."
# We pipe the modelfile content into the container
docker compose exec -T ollama ollama create YemenJPT -f /root/.ollama/Modelfile.YemenJPT || \
docker compose exec -T ollama ollama create YemenJPT -f /app/backend/data/Modelfile.YemenJPT || \
echo "Warning: Could not create custom model automatically. Use manual creation."

echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}   DEPLOYMENT COMPLETE - YemenJPT is Live!              ${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "Main Interface:    https://ai.ph-ye.org"
echo -e "API Docs:          https://ai.ph-ye.org/docs"
echo -e "Files (MinIO):     https://files.ai.ph-ye.org"
echo -e "Automation (n8n):  https://automation.ai.ph-ye.org"
echo -e ""
echo -e "Master Username:   admin"
echo -e "Check .env for your generated passwords."
