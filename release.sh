#!/bin/bash

VERSION=$1
IMAGE="ui-client"

if [ -z "$IMAGE" ]; then echo "no image provided"; exit 1; fi
if [ -z "$VERSION" ]; then echo "no version provided"; exit 2; fi

echo "Building Docker image ..."
docker build -t registry.internal.instana.io/instana/$IMAGE .
docker tag -f registry.internal.instana.io/instana/$IMAGE registry.internal.instana.io/instana/$IMAGE:$VERSION

echo "Publishing Docker image ..."
docker push registry.internal.instana.io/instana/$IMAGE
