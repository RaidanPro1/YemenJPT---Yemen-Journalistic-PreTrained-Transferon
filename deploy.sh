
#!/bin/bash

# ==============================================================================
# YemenJPT Master Deploy Script v10.0 - Cloudflare Integrated
# Target: Ubuntu 24.04 LTS | IP: 13.61.154.217
# Base Domain: ph-ye.org
# ==============================================================================

set -e

# --- CONFIGURATION ---
BASE_DOMAIN="ph-ye.org"
SERVER_IP="13.61.154.217"
INSTALL_DIR="/opt/yemenjpt"
CF_TOKEN="o9e6x3TRENSogHOBQ5AYpKFXzXnhbPY2Ztqw3IKG"
ZONE_ID="9b9834581bbbe346420c570113de0087"

# Visuals
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}>>> INITIATING SOVEREIGN DEPLOYMENT: $BASE_DOMAIN <<<${NC}"

# 1. ROOT CHECK
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Error: Run as root (sudo ./deploy.sh)${NC}"
  exit 1
fi

# 2. CLOUDFLARE DNS SYNC
echo -e "${YELLOW}[1/7] Syncing DNS Records with Cloudflare...${NC}"

declare -A SUBDOMAINS=(
    ["ai"]="Main Hub & API"
    ["files"]="Secure Vault Access"
    ["automation"]="n8n Workflows"
    ["control"]="System Admin & DB"
    ["radar"]="NLP Engine"
    ["meter"]="Legal Compliance"
    ["voice"]="Audio Forensics"
    ["scan"]="Visual Forensics"
)

for sub in "${!SUBDOMAINS[@]}"; do
    DOMAIN="$sub.$BASE_DOMAIN"
    echo -n "Checking $DOMAIN... "
    
    # Simple Cloudflare API call to update or create A record
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
         -H "Authorization: Bearer $CF_TOKEN" \
         -H "Content-Type: application/json" \
         --data "{\"type\":\"A\",\"name\":\"$sub\",\"content\":\"$SERVER_IP\",\"ttl\":120,\"proxied\":true}" | jq -r '.success' | grep -q "true" && echo -e "${GREEN}SUCCESS${NC}" || echo -e "${YELLOW}Record might already exist or API error (skipping)${NC}"
done

# 3. SYSTEM PREP
echo -e "${YELLOW}[2/7] Installing Dependencies...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y nginx docker.io docker-compose-v2 curl jq git build-essential ufw

# 4. NATIVE OLLAMA
echo -e "${YELLOW}[3/7] Setting up Native AI Engine (Ollama)...${NC}"
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
fi
systemctl enable ollama
systemctl restart ollama

# 5. NGINX REVERSE PROXY CONFIG
echo -e "${YELLOW}[4/7] Configuring Nginx Routing Matrix...${NC}"

# A. Unified Hub (Frontend + API)
cat <<EOF > /etc/nginx/sites-available/ai.$BASE_DOMAIN
server {
    listen 80;
    server_name ai.$BASE_DOMAIN;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
    }

    location /token {
        proxy_pass http://127.0.0.1:8000/token;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
    }
}
EOF

# B. Files Domain
cat <<EOF > /etc/nginx/sites-available/files.$BASE_DOMAIN
server {
    listen 80;
    server_name files.$BASE_DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:8000/uploads/;
        proxy_set_header Host \$host;
    }
}
EOF

# C. Automation & Control
declare -A PROXIES=( ["automation"]="5678" ["control"]="8081" ["radar"]="8001" ["meter"]="8002" ["voice"]="8003" ["scan"]="8080" )
for sub in "${!PROXIES[@]}"; do
    PORT="${PROXIES[$sub]}"
    cat <<EOF > "/etc/nginx/sites-available/$sub.$BASE_DOMAIN"
server {
    listen 80;
    server_name $sub.$BASE_DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
    ln -sf "/etc/nginx/sites-available/$sub.$BASE_DOMAIN" "/etc/nginx/sites-enabled/"
done

ln -sf "/etc/nginx/sites-available/ai.$BASE_DOMAIN" "/etc/nginx/sites-enabled/"
ln -sf "/etc/nginx/sites-available/files.$BASE_DOMAIN" "/etc/nginx/sites-enabled/"
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 6. DOCKER STACK LAUNCH
echo -e "${YELLOW}[5/7] Starting Microservices...${NC}"
mkdir -p "$INSTALL_DIR"
cp -Ra . "$INSTALL_DIR/"
cd "$INSTALL_DIR"

if [ ! -f .env ]; then
    cp .env.example .env
    echo "API_BASE_URL=http://ai.ph-ye.org" >> .env
    echo "FILES_URL=http://files.ph-ye.org" >> .env
    echo "MASTER_PASSWORD=$(openssl rand -base64 12)" >> .env
fi

docker compose down || true
docker compose up -d --build

# 7. AI MODELS PROVISIONING
echo -e "${YELLOW}[6/7] Provisioning Sovereign AI Models...${NC}"
ollama pull llama3
if [ -f "backend/data/Modelfile.YemenJPT" ]; then
    ollama create YemenJPT -f backend/data/Modelfile.YemenJPT
fi

echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}   YEMENJPT IS LIVE ON ALL SUBDOMAINS                  ${NC}"
echo -e "${GREEN}========================================================${NC}"
echo -e "Main Application:    http://ai.ph-ye.org"
echo -e "Secure Storage:       http://files.ph-ye.org"
echo -e "Automation Hub:      http://automation.ph-ye.org"
echo -e "Admin Control:       http://control.ph-ye.org"
echo -e "Node IP:             $SERVER_IP"
echo -e "Check /opt/yemenjpt/.env for Master Credentials."
