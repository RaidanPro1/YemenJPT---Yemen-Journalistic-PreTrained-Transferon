
#!/bin/bash

# YemenJPT Sovereign Platform - One-Click Installer
# Target: Ubuntu 24.04 LTS (Noble Numbat)

set -e # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================================${NC}"
echo -e "${BLUE}   YemenJPT Sovereign Platform - Installation Wizard    ${NC}"
echo -e "${BLUE}   Target OS: Ubuntu 24.04 LTS                          ${NC}"
echo -e "${BLUE}========================================================${NC}"

# 1. Update System & Install Core Dependencies
echo -e "\n${GREEN}[1/5] Installing System Dependencies...${NC}"
sudo apt update
sudo apt install -y curl git jq build-essential libmagic1 ffmpeg ca-certificates gnupg

# 2. Install Docker Engine (Official Docker Repo for Ubuntu 24.04)
if ! command -v docker &> /dev/null; then
    echo -e "${GREEN}[+] Installing Docker...${NC}"
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
    echo -e "${GREEN}[+] Docker already installed.${NC}"
fi

# Ensure current user can run docker
sudo usermod -aG docker $USER

# 3. Install Node.js 20 (LTS)
if ! command -v npm &> /dev/null; then
    echo -e "\n${GREEN}[2/5] Installing Node.js 20 LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}[+] Node.js already installed.${NC}"
fi

# 4. Install Ollama (Local AI Engine)
if ! command -v ollama &> /dev/null; then
    echo -e "\n${GREEN}[3/5] Installing Ollama (AI Engine)...${NC}"
    curl -fsSL https://ollama.com/install.sh | sh
    
    # Start Ollama Service if not running
    if ! pgrep -x "ollama" > /dev/null; then
        echo "Starting Ollama..."
        ollama serve > /dev/null 2>&1 &
        sleep 5
    fi
else
    echo -e "${GREEN}[+] Ollama already installed.${NC}"
fi

# 5. Project Setup
echo -e "\n${GREEN}[4/5] Configuring Project...${NC}"

# Create directories if they don't exist
mkdir -p backend/data uploads shared-uploads

# Install Frontend Dependencies
if [ -f "package.json" ]; then
    echo "Installing frontend packages..."
    npm install
else
    echo -e "${RED}[!] package.json not found. Are you in the root directory?${NC}"
fi

# Setup Python Environment (Optional if running outside Docker)
echo "Setting up local Python environment tools..."
sudo apt install -y python3-venv python3-pip

# 6. Launch Instructions
echo -e "\n${BLUE}========================================================${NC}"
echo -e "${GREEN}   INSTALLATION COMPLETE!   ${NC}"
echo -e "${BLUE}========================================================${NC}"
echo -e "To start the platform, run the following commands:"
echo -e ""
echo -e "1. ${GREEN}sudo docker compose up -d --build${NC}  (Starts Backend, DB, Automation)"
echo -e "2. ${GREEN}npm run dev${NC}                        (Starts Frontend Interface)"
echo -e ""
echo -e "Access the platform at: http://localhost:3000"
echo -e "API Documentation at:   http://localhost:8000/docs"
echo -e "${BLUE}========================================================${NC}"

# Make script executable
chmod +x install.sh
