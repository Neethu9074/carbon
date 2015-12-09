#!/bin/sh

DEBUG=instana-nodejs-sensor:* \
  /opt/www/node_modules/babel/bin/babel-node.js \
  /opt/www/index.js 2>&1 | logger -t in-server
