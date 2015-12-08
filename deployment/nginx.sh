#!/bin/sh

exec 1> >(logger -s -t in-server) 2>&1

nginx -g "daemon off;"
