#!/bin/bash

mainpath='/opt/instana/ui-client'

cd $mainpath

export NODE_ENV=production
export PATH=/opt/instana/nodejs/bin:$PATH

exec node ${mainpath}/index.js 2>&1
