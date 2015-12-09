#!/bin/sh

nginx -g "daemon off;" 2>&1 | logger -t nginx
