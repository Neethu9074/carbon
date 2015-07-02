#!/bin/bash

version=`node -e 'console.log(require("./package.json").version)'`
imageName="registry.internal.instana.io/instana/ui-client"
qualifiedImageName="$imageName:$version"
echo $qualifiedImageName

echo "Building Docker image ..."
sudo docker build -t "$qualifiedImageName" .

echo "Tagging Docker image ..."
echo "> current"
sudo docker tag -f "$qualifiedImageName" "$imageName:current"

if [[ $INSTANA_RELEASE_CONTAINERS == "true" ]]; then
  echo "> stable"
  sudo docker tag -f "$qualifiedImageName" "$imageName:stable"
fi

echo "Publishing Docker image ..."
sudo docker push "$imageName"
