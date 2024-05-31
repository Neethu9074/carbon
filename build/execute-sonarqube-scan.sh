#!/usr/bin/env bash

set -euo pipefail

cd `dirname $BASH_SOURCE`/..

SONARQUBE_SCANNER_VERSION="4.8.1.3023"
SONARQUBE_URL="https://sonarqube.instana.io"

echo "Download SonarQube scanner"
rm -rf "sonar-scanner-$SONARQUBE_SCANNER_VERSION"
wget "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SONARQUBE_SCANNER_VERSION.zip"
unzip "sonar-scanner-cli-$SONARQUBE_SCANNER_VERSION.zip"

echo "Configuring SonarQube scanner"
echo "sonar.host.url=$SONARQUBE_URL" > "sonar-scanner-$SONARQUBE_SCANNER_VERSION/conf/sonar-scanner.properties"

echo "Install all dependencies"
yarn install --frozen-lockfile
pushd packages/in-server
yarn install --frozen-lockfile
popd

echo "Generate the lcov coverage report"
echo "Starting unit tests for client with coverage {"
yarn test:unit --coverage --detectOpenHandles --forceExit
echo "} Ended unit tests for clientwith coverage"
pushd packages/in-server
echo "Starting unit tests for server with coverage {"
yarn test --coverage --detectOpenHandles --forceExit
echo "} Ended unit tests for server with coverage"
popd

echo "Generate the ESLint report"
yarn run --silent test:lint -f json > eslint-report.json

echo "Run SonarQube scan"
"./sonar-scanner-$SONARQUBE_SCANNER_VERSION/bin/sonar-scanner" -Dsonar.login=$SONARQUBE_TOKEN -Dsonar.branch.name=$GIT_BRANCH
