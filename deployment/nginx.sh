#!/bin/sh

set -eo pipefail

j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf && \
  j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key && \
  nginx -g "daemon off;" 2>&1 | logger -t nginx
