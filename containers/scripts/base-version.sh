#!/bin/bash

set -euo pipefail
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

# This is the version of the Instana base image that is used for all images
# Some images need a specific runtime included, others do not.
# Please see backend/containers/runtimes/README.md for more details on
# these runtime/base images
BASE_VERSION=$(cat $SCRIPTPATH/../BASE_VERSION)
