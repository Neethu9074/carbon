#!/bin/bash

set -eo pipefail

for (( ; ; )) do
  curl -X POST -v https://internal-logs.instana.io/log/v1 \
       --header "x-instana-key: 2f83c6e2-6c31-44c2-a060-f808b24defda" \
       --header "Content-Type: application/json" \
       -d "{
    \"@timestamp\": \"$(node -e 'console.log(new Date().toISOString())')\",
    \"message\": \"this is a test\n wazzzup\nmultiline\",
    \"host\": \"0a:35:2f:ff:fe:85:68:a1\"
  }"

  sleep 1;
done
