#!/bin/bash
# ==============================================================================
# YemenJPT Master Install Script v7.5
# Target OS: Ubuntu 24.04 LTS
# ==============================================================================

set -e
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${CYAN}--- STARTING SOVEREIGN INSTALLATION: YemenJPT ---${NC}"

# 1. System Update
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git jq ufw docker.io docker-compose-v2 rclone build-essential python3-pip python3-venv ffmpeg

# 2. Security Configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 3. Create Structure
mkdir -p yemenjpt/{gateway,nlp-engine,forensics-service,legal-meter,voice-legacy,shared-uploads,db_data,qdrant_data}
cd yemenjpt

# 4. MASTER SECRETS INJECTION
echo -e "${GREEN}[INJECTING SECRETS] Creating .env file...${NC}"
cat > .env <<EOF
# --- MASTER CREDENTIALS ---
MASTER_PASS=Samah@2052024X
DB_ROOT_PASSWORD=Samah@2052024X
DB_USER=raidan_admin
DB_NAME=raidan_vault
REDIS_PASSWORD=Samah@2052024X

# --- AI KEYS ---
OPENAI_API_KEY=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
GEMINI_API_KEY=AIzaSyAy7cD5uJ4k60pa2YAb4ub7q5JLIFFo-mI
HF_TOKEN_READ=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

# --- STORAGE (CONTABO S3) ---
AWS_ACCESS_KEY_ID=45c5796c47d41e6c064fa73e62425930
AWS_SECRET_ACCESS_KEY=8149962a8d5c6031955ae499a8a5ec6bc
AWS_ENDPOINT=https://usc1.contabostorage.com
AWS_REGION=US-central
AWS_BUCKET=raidanpro

# --- LOCALIZATION ---
TIMEZONE=Asia/Aden
DEFAULT_LOCALE=ar-YE
EOF

# 5. Rclone Setup
mkdir -p ~/.config/rclone/
cat > ~/.config/rclone/rclone.conf <<EOF
[contabo]
type = s3
provider = Other
env_auth = false
access_key_id = 45c5796c47d41e6c064fa73e62425930
secret_access_key = 8149962a8d5c6031955ae499a8a5ec6bc
endpoint = https://usc1.contabostorage.com
region = US-central
EOF

# 6. Build and Start
sudo docker compose up -d

# 7. Notify
curl -s -X POST "https://api.telegram.org/bot8553949895:AAGhdsSOo2CHSyztjunUSiJf9hOX1gcyWFI/sendMessage" \
     -d "chat_id=8595385689" \
     -d "text=🚀 YemenJPT NODE ONLINE: $(hostname) is fully configured and secured."

echo -e "${GREEN}SUCCESS: YemenJPT is live. System online.${NC}"
