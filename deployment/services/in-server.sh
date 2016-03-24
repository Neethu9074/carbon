#!/bin/bash

set -e

cd /opt
source discovery/discovery.general

j2 /opt/www/config.json.j2 > /opt/www/assets/config.json
j2 /opt/www/serverConfig.json.j2 > /opt/www/serverConfig.json
exec node /opt/www/index.js 2>&1 | logger -t ui-client-in-server
