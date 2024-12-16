#!/usr/bin/env bash

set -eo pipefail

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
