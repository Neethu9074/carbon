#!/usr/bin/env bash

# Instead of using ci-shared-tools as a git submodule, we now download a versioned
# GitHub Release of that project from https://github.com/instana/ci-shared-tools/releases.
# This will hopefully avoid submodule version clobbering when Pull Requests or older
# release branches are merged.

set -euo pipefail

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

VERSION="v0.0.1"
PROJECT="ci-shared-tools"
REPO="instana/${PROJECT}"
ASSET_FILE="ci-shared-tools-${VERSION}.tar.gz"
GITHUB_API_URL="https://api.github.com"

echo "-- Downloading ${ASSET_FILE}"
wget -q --auth-no-challenge \
  --header='Accept: application/vnd.github.v3+json' \
  https://${GITHUB_API_TOKEN}:@api.github.com/repos/$REPO/tarball/${VERSION} \
  -O "${SCRIPTPATH}/${ASSET_FILE}"

echo "-- Extracting ${ASSET_FILE}"
mkdir -p "${SCRIPTPATH}/${PROJECT}"
tar xfz "${SCRIPTPATH}/${ASSET_FILE}" -C "${SCRIPTPATH}/${PROJECT}" --strip-components=1
rm "${SCRIPTPATH}/${ASSET_FILE}"
