FROM registry.internal.instana.io/instana/base:stable

MAINTAINER Ben Ripkens "ben@instana.com"

# ###################################################
# START OFFICIAL NGINX DOCKERFILE
# this is taken from the official nginx Dockerfile
# https://github.com/nginxinc/docker-nginx/
#
# Take note that this was adapted to fit to the baseimage, i.e. the distro
# and nginx version is changed to Ubuntu and the ubuntu release name
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
RUN echo "deb http://nginx.org/packages/mainline/ubuntu/ trusty nginx" >> /etc/apt/sources.list
ENV NGINX_VERSION 1.9.4-1~trusty
RUN apt-get update && \
    apt-get install -y ca-certificates nginx=${NGINX_VERSION} && \
    rm -rf /var/lib/apt/lists/*
# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
# END OFFICIAL NGINX DOCKERFILE
# ###################################################


# ###################################################
# START OFFICIAL IOJS 2.5.0 DOCKERFILE
# this is taken from the official iojs Dockerfile
# https://github.com/nodejs/docker-iojs/blob/master/2.5/slim/Dockerfile
# gpg keys listed at https://github.com/nodejs/io.js
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key" \
  ; done

ENV NPM_CONFIG_LOGLEVEL info
ENV IOJS_VERSION 2.5.0

RUN curl -SLO "https://iojs.org/dist/v$IOJS_VERSION/iojs-v$IOJS_VERSION-linux-x64.tar.gz" \
  && curl -SLO "https://iojs.org/dist/v$IOJS_VERSION/SHASUMS256.txt.asc" \
  && gpg --verify SHASUMS256.txt.asc \
  && grep " iojs-v$IOJS_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
  && tar -xzf "iojs-v$IOJS_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "iojs-v$IOJS_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc
# END OFFICIAL IOJS 2.5.0 DOCKERFILE
# ###################################################

COPY deployment/nginx.conf.j2 /etc/nginx/nginx.conf.j2
COPY deployment/mime.types /etc/nginx/mime.types
COPY deployment/.htpasswd /etc/nginx/.htpasswd
COPY target /opt/www
COPY node_modules /opt/www/node_modules
COPY deployment/config.json.j2 /opt/www/config.json.j2
COPY deployment/star_instana_io.crt /etc/ssl/certs/star_instana_io.crt
COPY deployment/star_instana_io.key /opt/www/star_instana_io.key.j2
COPY deployment/dhgroup.pem /etc/ssl/dhgroup.pem

CMD j2 /etc/nginx/nginx.conf.j2 > /etc/nginx/nginx.conf && \
  j2 /opt/www/config.json.j2 > /opt/www/config.json && \
  j2 /opt/www/star_instana_io.key.j2 > /etc/ssl/private/star_instana_io.key && \
  nginx && /opt/www/node_modules/.bin/babel-node /opt/www/index.js

EXPOSE 80 443
