#!/bin/bash

set -e

cd /tmp
source discovery/discovery.general

j2 /opt/www/config.json.j2 > /opt/www/assets/config.json
j2 /opt/www/serverConfig.json.j2 > /opt/www/serverConfig.json
exec /opt/www/node_modules/babel/bin/babel-node.js /opt/www/index.js 2>&1 | logger -t ui-client-in-server
