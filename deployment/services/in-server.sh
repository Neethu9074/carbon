#!/bin/bash

set -e

discovery_options=${DISCOVERY//,/$'\n'}
for discovery_option in $discovery_options
do
    source /tmp/discovery/$discovery_option
done

j2 /opt/www/config.json.j2 > /opt/www/assets/config.json
j2 /opt/www/serverConfig.json.j2 > /opt/www/serverConfig.json
exec /opt/www/node_modules/babel/bin/babel-node.js /opt/www/index.js 2>&1 | logger -t ui-client-in-server
