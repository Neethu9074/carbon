#!/bin/bash

set -euo pipefail
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

source "${SCRIPTPATH}/build.sh"
# disabling this so we don't push from my branch while testing. Re-enable before merging the PR to develop
# source "${SCRIPTPATH}/publish.sh"
