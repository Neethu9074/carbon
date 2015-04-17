FROM instana-docker:8080/instana/base:0.2.1

MAINTAINER Ben Ripkens "ben@instana.com"

# ###################################################
# START OFFICIAL NGINX DOCKERFILE
# this is taken from the official nginx Dockerfile
# https://github.com/nginxinc/docker-nginx/
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
RUN echo "deb http://nginx.org/packages/mainline/debian/ wheezy nginx" >> /etc/apt/sources.list
ENV NGINX_VERSION 1.7.12-1~wheezy
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
COPY target /opt/www

RUN pip install j2cli

# TODO:
# - use j2cli to write nginx config file with environment vars
# - adapt nginx.conf.js to docker environment vars

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80 443
