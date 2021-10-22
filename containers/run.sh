#!/bin/bash

mainpath='/opt/instana/ui-client'

cd $mainpath

export NODE_ENV=production

exec node ${mainpath}/index.js 2>&1
