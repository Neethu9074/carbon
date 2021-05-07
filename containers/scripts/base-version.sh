#!/bin/bash

set -euo pipefail

# This is the version of the Instana base image that is used for all images
# Some images need a specific runtime included, others do not.
# Please see backend/containers/runtimes/README.md for more details on
# these runtime/base images
BASE_VERSION=0.0.10
