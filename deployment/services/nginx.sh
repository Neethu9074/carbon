#!/bin/bash

set -e

source /opt/discovery/discovery.general

j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf
j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key
j2 /etc/ssl/certs/star_instana_io.crt.j2 > /etc/ssl/certs/star_instana_io.crt
j2 /etc/ssl/dhgroup.pem.j2 > /etc/ssl/dhgroup.pem
exec nginx -g "daemon off;" 2>&1 | logger -t ui-client-nginx
