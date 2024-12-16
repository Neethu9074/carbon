#!/usr/bin/env bash

# Instead of using ci-shared-tools as a git submodule, we now download a versioned
# GitHub Release of that project from https://github.ibm.com/instana/ci-shared-tools/releases.
# This will hopefully avoid submodule version clobbering when Pull Requests or older
# release branches are merged.

set -euo pipefail

SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

VERSION="v0.1.20"
PROJECT="ci-shared-tools"
REPO="instana/${PROJECT}"
ASSET_FILE="ci-shared-tools-${VERSION}.tar.gz"
GITHUB_API_URL="github.ibm.com/api/v3"

echo "-- Downloading ${ASSET_FILE}"
wget -q --auth-no-challenge \
  --header='Accept: application/vnd.github.v3+json' \
  https://${GITHUB_API_TOKEN}:@${GITHUB_API_URL}/repos/$REPO/tarball/${VERSION} \
  -O "${SCRIPT_PATH}/${ASSET_FILE}"

echo "-- Extracting ${ASSET_FILE}"
mkdir -p "${SCRIPT_PATH}/${PROJECT}"
tar xfz "${SCRIPT_PATH}/${ASSET_FILE}" -C "${SCRIPT_PATH}/${PROJECT}" --strip-components=1
rm "${SCRIPT_PATH}/${ASSET_FILE}"
