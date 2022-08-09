#!/bin/bash

set -euo pipefail
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

source "${SCRIPTPATH}/shared.sh"

function _remove_from_local_registry {
  _log_info "Removing $1 from local registry"
  docker rmi -f $1
}

function _cleanup_container_dir {
  _log_info "Removing ${COMPONENTS_HOME_DIR}/.container*"
  rm -rf "${COMPONENTS_HOME_DIR}/.container"*
}

function _run_docker_buildx {
  local TAG=$1
  local PATH_TO_CONTAINER_FILE=$2
  local DESIRED_IMAGE_VERSION=$3
  local TARGET_OVERRIDE=${4:-'none'}
  _log_info "Building multi-arch image ${TAG}"

  local REGISTRY_USERNAME
  local REGISTRY_PASSWORD

  if [[ ${ARTIFACT_VERSION} == 'local' ]]; then
    REGISTRY_AUTH=$(yarn config get '//artifact-rnd.instana.io/artifactory/api/npm/npm-virtual-internal/:_auth' | base64 -d)
    IFS=':' read -r REGISTRY_USERNAME REGISTRY_PASSWORD <<< "$REGISTRY_AUTH"
  else
    REGISTRY_USERNAME=${ARTIFACT_RND_INSTANA_IO_USER}
    REGISTRY_PASSWORD=${ARTIFACT_RND_INSTANA_IO_PASSWORD}
  fi
docker buildx build \
    --tag $TAG \
    --progress plain \
    --cache-from $TAG \
    --platform=linux/amd64,linux/s390x \
    --build-arg base_version=${BASE_VERSION} \
    --build-arg component_name=${COMPONENT_NAME} \
    --build-arg image_version=${DESIRED_IMAGE_VERSION} \
    --build-arg branch=${BRANCH_NAME} \
    --build-arg commit_id=${COMMIT_ID} \
    --build-arg registry='https://artifact-rnd.instana.io' \
    --build-arg repository_key='npm-virtual-internal' \
    --build-arg registry_username=${REGISTRY_USERNAME} \
    --build-arg registry_password=${REGISTRY_PASSWORD} \
    -f ${PATH_TO_CONTAINER_FILE} \
    -t ${TAG} \
    ${COMPONENT_CONTAINER_DIR} \
    --push
}

function push_image {
  if [[ ${ARTIFACT_VERSION} == 'local' ]]; then
    _log_info "Images built locally will not be pushed to the remote registry"
    exit 0
  else
    _check_branch_name
    _docker_login
    _log_info "We are 'rebuilding' the image in this push step because docker buildx multi-arch builds require build and push to be run in the same command. \
    https://docs.docker.com/buildx/working-with-buildx/"
    _run_docker_buildx ${FULLY_QUALIFIED_TAG} ${CONTAINER_FILE} ${IMAGE_VERSION}
    _remove_from_local_registry $1
  fi

  _cleanup_container_dir
}

push_image ${FULLY_QUALIFIED_TAG}
