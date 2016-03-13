#!/bin/bash

set -e

discovery_options=${DISCOVERY//,/$'\n'}
for discovery_option in $discovery_options
do
    source /tmp/discovery/$discovery_option
done

j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf
j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key
exec nginx -g "daemon off;" 2>&1 | logger -t ui-client-nginx
