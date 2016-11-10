#!/bin/bash

if [[ "$ENVIRONMENT" != "fleet" ]]; then
  echo "Not fleet environment. Not starting the nginx."
  sleep 600
  exit
fi

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

j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf
if [ ! -f /etc/ssl/private/star_instana_io.key ]; then
  j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key
  j2 /etc/ssl/certs/star_instana_io.crt.j2 > /etc/ssl/certs/star_instana_io.crt
fi

j2 /etc/ssl/dhgroup.pem.j2 > /etc/ssl/dhgroup.pem

exec nginx -g "daemon off;" 2>&1 | logger -t ui-client-nginx
