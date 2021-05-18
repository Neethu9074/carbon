#!/bin/bash

set -euo pipefail

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

COLOR_RED='\033[0;31m'
COLOR_BLUE='\033[0;34m'
COLOR_NONE='\033[0m' # No Color

COMPONENT_NAME='ui-client'
CONTAINER_IMAGE_NAME=${CONTAINER_IMAGE_NAME:-$1}
VERSION=${VERSION:-local}
CONTAINER_VERSION="3.${VERSION#*.}"
ITERATION=${ITERATION:-0}
BRANCH_NAME=${BRANCH_NAME:-`git rev-parse --abbrev-ref HEAD`}
COMMIT_ID=${COMMIT_ID:-replace-me-commit-id}

IMAGE_URI="containers.instana.io/instana/${BRANCH_NAME}/product/${CONTAINER_IMAGE_NAME}"
FULLY_QUALIFIED_TAG="${IMAGE_URI}:${CONTAINER_VERSION}-${ITERATION}"
UI_CLIENT_ROOT_DIR="${SCRIPTPATH}/../.."
COMPONENTS_HOME_DIR="${SCRIPTPATH}/.."
COMPONENT_CONTAINER_DIR="${COMPONENTS_HOME_DIR}/.container.${CONTAINER_IMAGE_NAME}"
COMPONENT_BUILD_DIR="${COMPONENT_CONTAINER_DIR}/build"
COMPONENT_WORK_DIR="${COMPONENT_CONTAINER_DIR}/work"
COMPONENT_USR_BIN_DIR="${COMPONENT_BUILD_DIR}/usr/bin"
OPT_INSTANA_DIR="${COMPONENT_BUILD_DIR}/opt/instana"
COMPONENT_OPT_INSTANA_DIR="${OPT_INSTANA_DIR}/${COMPONENT_NAME}"
COMPONENT_ETC_INSTANA_DIR="${COMPONENT_BUILD_DIR}/etc/instana/${COMPONENT_NAME}"
COMPONENT_CONTAINER_FILE="${COMPONENTS_HOME_DIR}/container"
COMPONENT_RUN_SCRIPT="${COMPONENTS_HOME_DIR}/run.sh"
ARTIFACTORY_BASE_REPO_URL="https://artifact-rnd.instana.io/artifactory/backend-releases/com/instana"
COMPONENT_TAR_GZ_URL="${ARTIFACTORY_BASE_REPO_URL}/${COMPONENT_NAME}/${VERSION}/${COMPONENT_NAME}-${VERSION}-${BRANCH_NAME}.tar.gz"

function _log_info {
  echo -e "-- ${COLOR_BLUE}${@}${COLOR_NONE}"
}

function _log_error {
	echo -e "---- ${COLOR_RED}${@}${COLOR_NONE}"
}

function _docker_login() {
  if [[ ${VERSION} == 'local' ]]; then
    _log_info "Skipping docker login for local builds"
  else
    _log_info "Login to containers.instana.io"
    echo "${CONTAINERS_INSTANA_IO_PASSWORD}" | docker login -u ${CONTAINERS_INSTANA_IO_USER} --password-stdin "https://containers.instana.io"
  fi
}

function _check_branch_name {
  if [[ ${VERSION} == 'local' ]]; then
    _log_info "Skipping branch name check for local builds"
  else
    IS_DELIVERY_BRANCH=$(${UI_CLIENT_ROOT_DIR}/build/ci-shared-tools/scripts/isDeliveryBranch.js)
    if [[ "${IS_DELIVERY_BRANCH}" != "true"* ]]; then
      _log_error "Container image building and pushing are not valid for non-delivery branch ${BRANCH_NAME}"
      exit 1
    fi
  fi
}
