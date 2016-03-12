#!/bin/bash

set -e

# resolve dependencies through consul
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
export REGION=${REGION::-1}

export UI_BACKEND_PORT_8080_TCP_PORT=8080
export UI_BACKEND_PORT_8082_TCP_PORT=8082

UI_BACKEND_PORT_8080_TCP_ADDR=$(curl -s http://localhost:8500/v1/catalog/service/$REGION-$ENVIRONMENT-redis | jq '.[0].Address')
export UI_BACKEND_PORT_8080_TCP_ADDR=${UI_BACKEND_PORT_8080_TCP_ADDR:1:-1}
export UI_BACKEND_PORT_8082_TCP_ADDR=$UI_BACKEND_PORT_8080_TCP_ADDR

j2 /opt/www/config.json.j2 > /opt/www/assets/config.json
j2 /opt/www/serverConfig.json.j2 > /opt/www/serverConfig.json
exec /opt/www/node_modules/babel/bin/babel-node.js /opt/www/index.js 2>&1 | logger -t ui-client-in-server
