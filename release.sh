#!/bin/bash

VERSION=$1
IMAGE=ui-client

if [ -z "$IMAGE" ]; then echo "no image provided"; exit 1; fi
if [ -z "$VERSION" ]; then echo "no version provided"; exit 2; fi

echo "Building Docker image ..."
echo "> $VERSION"
docker build -t registry.internal.instana.io/instana/$IMAGE:$VERSION .

echo "Tagging Docker image ..."
echo "> current"
docker tag -f registry.internal.instana.io/instana/$IMAGE:$VERSION registry.internal.instana.io/instana/$IMAGE:current

if [[ $INSTANA_RELEASE_CONTAINERS == "true" ]]; then
  echo "> stable"
  docker tag -f registry.internal.instana.io/instana/$IMAGE:$VERSION registry.internal.instana.io/instana/$IMAGE:stable
fi

echo "Publishing Docker image ..."
docker push registry.internal.instana.io/instana/$IMAGE
