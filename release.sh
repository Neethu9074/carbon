#!/bin/sh

version=`node -e 'console.log(require("./package.json").version)'`
imageName="instana-docker:8080/instana/ui-client"
qualifiedImageName="$imageName:$version"
echo $qualifiedImageName

echo "Building Docker image..."
docker build -t "$qualifiedImageName" .
#sudo docker tag -f "$qualifiedImageName" "$imageName:latest"

echo "Publishing Docker image..."
#sudo docker push "$qualifiedImageName"
