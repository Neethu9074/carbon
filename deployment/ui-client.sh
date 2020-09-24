#!/bin/bash

set -e

ln -f -s /local/config.json /opt/www/assets/config.json
ln -f -s /local/serverConfig.json /opt/www/serverConfig.json

export NODE_ENV=production

echo "Executing:"
echo "node /opt/www/index.js | /opt/www/node_modules/.bin/bunyan 2>&1"

node /opt/www/index.js 2>&1
