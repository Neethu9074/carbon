FROM registry.internal.instana.io/instana/nginx-nodejs:latest

MAINTAINER Ben Ripkens "ben@instana.com"

COPY deployment/nginx.conf.j2 /etc/nginx/nginx.conf.j2
COPY deployment/mime.types /etc/nginx/mime.types
COPY deployment/.htpasswd /etc/nginx/.htpasswd
COPY target /opt/www
COPY deployment/config.json.j2 /opt/www/config.json.j2
COPY deployment/serverConfig.json.j2 /opt/www/serverConfig.json.j2
COPY deployment/star_instana_io.crt /etc/ssl/certs/star_instana_io.crt
COPY deployment/star_instana_io.key /opt/www/star_instana_io.key.j2
COPY deployment/dhgroup.pem /etc/ssl/dhgroup.pem

CMD j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf && \
  j2 /opt/www/config.json.j2 > /opt/www/assets/config.json && \
  j2 /opt/www/serverConfig.json.j2 > /opt/www/serverConfig.json && \
  j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key && \
  nginx && DEBUG=instana-nodejs-sensor:* /opt/www/node_modules/babel/bin/babel-node.js /opt/www/index.js

EXPOSE 80 443
