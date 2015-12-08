#!/bin/sh

exec 1> >(logger -s -t in-server) 2>&1

DEBUG=instana-nodejs-sensor:* \
  /opt/www/node_modules/babel/bin/babel-node.js \
  /opt/www/index.js
