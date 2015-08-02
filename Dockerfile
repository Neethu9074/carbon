FROM registry.internal.instana.io/instana/base:1.0.0

MAINTAINER Ben Ripkens "ben@instana.com"

# ###################################################
# START OFFICIAL NGINX DOCKERFILE
# this is taken from the official nginx Dockerfile
# https://github.com/nginxinc/docker-nginx/
#
# Take not that this was adapted to fit to the baseimage, i.e. the distro
# and nginx version is changed to Ubuntu and the ubuntu release name
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
RUN echo "deb http://nginx.org/packages/mainline/ubuntu/ trusty nginx" >> /etc/apt/sources.list
ENV NGINX_VERSION 1.9.3-1~trusty
RUN apt-get update && \
    apt-get install -y ca-certificates nginx=${NGINX_VERSION} && \
    rm -rf /var/lib/apt/lists/*
# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
# END OFFICIAL NGINX DOCKERFILE
# ###################################################

COPY deployment/nginx.conf.j2 /etc/nginx/nginx.conf.j2
COPY deployment/mime.types /etc/nginx/mime.types
COPY deployment/.htpasswd /etc/nginx/.htpasswd
COPY target /opt/www
COPY deployment/config.json.j2 /opt/www/config.json.j2
COPY deployment/star_instana_io.crt /etc/ssl/certs/star_instana_io.crt
COPY deployment/star_instana_io.key /opt/www/star_instana_io.key.j2
COPY deployment/dhgroup.pem /etc/ssl/dhgroup.pem

RUN pip install j2cli

CMD j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf && \
  j2 /opt/www/config.json.j2 > /opt/www/config.json && \
  j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key && \
  nginx -g "daemon off;"

EXPOSE 80 443
