#!/bin/bash
# Nginx Configuration Generator for YemenJPT
# Author: YemenJPT Network Eng.

DOMAIN="raidan.pro"
NGINX_PATH="/etc/nginx/sites-available"

declare -A PORT_MAP=(
    ["api"]="8000"
    ["meter"]="8002"
    ["radar"]="8001"
    ["voice"]="8003"
    ["vault"]="9000"
    ["studio"]="5678"
    ["ops"]="8081"
)

for sub in "${!PORT_MAP[@]}"; do
    PORT="${PORT_MAP[$sub]}"
    FILE="${NGINX_PATH}/${sub}.${DOMAIN}.conf"
    
    echo "Generating config for ${sub}.${DOMAIN} -> Port ${PORT}"
    
    sudo cat > "$FILE" <<EOF
server {
    listen 80;
    server_name ${sub}.${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
    sudo ln -sf "$FILE" "/etc/nginx/sites-enabled/${sub}.${DOMAIN}.conf"
done

sudo nginx -t && sudo systemctl restart nginx
