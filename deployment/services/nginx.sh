#!/bin/bash

set -e

# resolve dependencies through consul
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
export REGION=${REGION::-1}

export UI_BACKEND_PORT_8080_TCP_PORT=8080
export UI_BACKEND_PORT_8082_TCP_PORT=8082

UI_BACKEND_PORT_8080_TCP_ADDR=$(curl -s http://localhost:8500/v1/catalog/service/$REGION-$INSTANA_ENVIRONMENT-$INSTANA_TENANT-$INSTANA_TEN
ANT_UNIT-ui-backend | jq '.[0].Address')
export UI_BACKEND_PORT_8080_TCP_ADDR=${UI_BACKEND_PORT_8080_TCP_ADDR:1:-1}
export UI_BACKEND_PORT_8082_TCP_ADDR=$UI_BACKEND_PORT_8080_TCP_ADDR

j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf
j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key
exec nginx -g "daemon off;" 2>&1 | logger -t ui-client-nginx
