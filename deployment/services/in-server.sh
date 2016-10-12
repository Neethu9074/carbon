#!/bin/bash

USER=root
if [[ "$USER_AND_GROUP_NAME" != "" ]]; then
  grep "${USER_AND_GROUP_NAME}:" /etc/passwd
  if [[ "$?" != "0" ]]; then
    groupadd -r $USER_AND_GROUP_NAME --gid=$GROUP_ID && useradd -r -g $USER_AND_GROUP_NAME --uid=$USER_ID $USER_AND_GROUP_NAME
  fi

  USER=$USER_AND_GROUP_NAME
fi

set -e

source /opt/discovery/discovery.general

j2 /opt/www/config.json.j2 > /opt/www/assets/config.json
j2 /opt/www/serverConfig.json.j2 > /opt/www/serverConfig.json
j2 /opt/www/index.js.j2 > /opt/www/index.js

export NODE_ENV=production
exec /sbin/setuser $USER node /opt/www/index.js | /sbin/setuser $USER /opt/www/node_modules/.bin/bunyan 2>&1 | logger -t ui-client-in-server
