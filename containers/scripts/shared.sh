#!/bin/bash

set -euo pipefail

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

COLOR_RED='\033[0;31m'
COLOR_BLUE='\033[0;34m'
COLOR_NONE='\033[0m' # No Color

COMPONENT_NAME='ui-client'
CONTAINER_IMAGE_NAME=${CONTAINER_IMAGE_NAME:-$1}
ARTIFACT_VERSION=${ARTIFACT_VERSION:-local}
IMAGE_VERSION=${IMAGE_VERSION:-'3.local-0'}
BRANCH_NAME=${BRANCH_NAME:-$(git rev-parse --abbrev-ref HEAD)}
COMMIT_ID=${COMMIT_ID:-replace-me-commit-id}
UI_CLIENT_ROOT_DIR="${SCRIPTPATH}/../.."
IS_DELIVERY_BRANCH=$(${UI_CLIENT_ROOT_DIR}/build/ci-shared-tools/scripts/isDeliveryBranch.js)

if [ "$IS_DELIVERY_BRANCH" == "true" ]  && [ "$BRANCH_NAME" != "develop" ]; then
  echo "Set IMAGE_URI for Release branch build"
  IMAGE_URI="delivery.instana.io/int-docker-ui-client-local/ui-client/${COMPONENT_NAME}"
else
  echo "Set IMAGE_URI for NON-Release branch build"
  IMAGE_URI="delivery.instana.io/int-docker-ui-client-local/ui-client/dev/${BRANCH_NAME}/${COMPONENT_NAME}"
fi

FULLY_QUALIFIED_TAG="${IMAGE_URI}:${IMAGE_VERSION}"
COMPONENTS_HOME_DIR="${SCRIPTPATH}/.."
COMPONENT_CONTAINER_DIR="${COMPONENTS_HOME_DIR}/.container.${CONTAINER_IMAGE_NAME}"
COMPONENT_BUILD_DIR="${COMPONENT_CONTAINER_DIR}/build"
COMPONENT_WORK_DIR="${COMPONENT_CONTAINER_DIR}/work"
COMPONENT_USR_BIN_DIR="${COMPONENT_BUILD_DIR}/usr/bin"
OPT_INSTANA_DIR="${COMPONENT_BUILD_DIR}/opt/instana"
COMPONENT_OPT_INSTANA_DIR="${OPT_INSTANA_DIR}/${COMPONENT_NAME}"
COMPONENT_CONTAINER_FILE="${COMPONENTS_HOME_DIR}/container"
COMPONENT_RUN_SCRIPT="${COMPONENTS_HOME_DIR}/run.sh"
ARTIFACTORY_BASE_REPO_URL="https://delivery.instana.io/artifactory/int-maven-legacy-backend-releases-local/com/instana"
COMPONENT_TAR_GZ_URL="${ARTIFACTORY_BASE_REPO_URL}/${COMPONENT_NAME}/${ARTIFACT_VERSION}/${COMPONENT_NAME}-${ARTIFACT_VERSION}-${BRANCH_NAME}.tar.gz"
TWISTLOCK_IGNOREFILES="${COMPONENTS_HOME_DIR}/twistlockignore-files"
COMPONENT_TWISTLOCK_IGNOREFILE="${TWISTLOCK_IGNOREFILES}/.twistlockignore-${COMPONENT_NAME}"

function _log_info {
  echo -e "-- ${COLOR_BLUE}${@}${COLOR_NONE}"
}

function _log_error {
	echo -e "---- ${COLOR_RED}${@}${COLOR_NONE}"
}

function _docker_login() {
  if [[ ${ARTIFACT_VERSION} == 'local' ]]; then
    _log_info "Skipping docker login for local builds"
  else
    _log_info "Login to delivery.instana.io"
    echo "${CONTAINERS_INSTANA_IO_PASSWORD}" | docker login -u ${CONTAINERS_INSTANA_IO_USER} --password-stdin "https://containers.instana.io"
    echo "${INSTANA_ARTIFACTORY_PASSWORD}" | docker login -u ${INSTANA_ARTIFACTORY_USERNAME} --password-stdin "https://delivery.instana.io"
  fi
}

function _check_branch_name {
  if [[ ${ARTIFACT_VERSION} == 'local' ]]; then
    _log_info "Skipping branch name check for local builds"
  elif [[ "${IS_DELIVERY_BRANCH}" != "true"* ]]; then
    _log_error "Container image building and pushing are not valid for non-delivery branch ${BRANCH_NAME}"
    exit 1
  fi
}
