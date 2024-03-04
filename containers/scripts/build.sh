#!/bin/bash

#
# IBM Confidential
# PID 5737-N85, 5900-AG5
# Copyright IBM Corp. 2022, 2022
#

set -euo pipefail
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

source "${SCRIPTPATH}/shared.sh"

function _check_prerequisites {
  if ! hash jq 2>/dev/null; then
    _log_info "Please install jq"
  fi

  case $CONTAINER_IMAGE_NAME in
    ui-client|ui-client-saas) _log_info "Building container image for [${CONTAINER_IMAGE_NAME}]" ;;
    *) _log_error "Unsupported container image [${CONTAINER_IMAGE_NAME}]"; exit 1;;
  esac
}

function _create_necessary_dirs {
  mkdir -p ${COMPONENT_BUILD_DIR} \
           ${COMPONENT_WORK_DIR}
}

function _create_usr_bin_dir {
  mkdir -p ${COMPONENT_USR_BIN_DIR}
}

function _create_opt_instana_dir {
  mkdir -p ${COMPONENT_OPT_INSTANA_DIR}
}

function _get_container_file {
  _log_info "container file ${COMPONENT_CONTAINER_FILE}"
  CONTAINER_FILE=${COMPONENT_CONTAINER_FILE}
}

function _get_run_sh {
  _log_info "run.sh script ${COMPONENT_RUN_SCRIPT}"
  RUN_SCRIPT=${COMPONENT_RUN_SCRIPT}

  _create_usr_bin_dir
  cp ${RUN_SCRIPT} "${COMPONENT_USR_BIN_DIR}/run.sh"
  case "$(uname -s)" in
    Darwin) sed -i '' -e "s/\${replace_me_component_name}/${COMPONENT_NAME}/" "${COMPONENT_USR_BIN_DIR}/run.sh";;
    Linux) sed -i -e "s/\${replace_me_component_name}/${COMPONENT_NAME}/" "${COMPONENT_USR_BIN_DIR}/run.sh";;
  esac
}

function _get_component_tar_gz {
  if [[ ${ARTIFACT_VERSION} == 'local' ]]; then
      _log_info "Building ${COMPONENT_NAME} tar.gz locally"
      pushd "${UI_CLIENT_ROOT_DIR}"
      pushd packages/in-server
      yarn --prod
      popd
      yarn run build
      FAIL_ON_DELIVERY_BRANCH=true ./build/ci-shared-tools/scripts/isDeliveryBranch.js || yarn run test:compression
      tar -czf "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz" target/*
      popd
  else
      _log_info "Downloading ${COMPONENT_TAR_GZ_URL} into ${COMPONENT_WORK_DIR}"
      curl -u ${INSTANA_ARTIFACTORY_USERNAME}:${INSTANA_ARTIFACTORY_PASSWORD} ${COMPONENT_TAR_GZ_URL} \
           --keepalive-time 5 \
           --output "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz"
  fi
}

function _extract_component_tar_gz {
  if [[ -f "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz" ]]; then
    _create_opt_instana_dir

    _log_info "Extracting ${COMPONENT_NAME}.tar.gz"
    if [[ ${CONTAINER_IMAGE_NAME} == 'ui-client' ]]; then
      _log_info "Removing *.map files for ${CONTAINER_IMAGE_NAME}"
      tar -xz --exclude='*.map' -f "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz" -C "${COMPONENT_OPT_INSTANA_DIR}"
    else
      tar -xz -f "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz" -C "${COMPONENT_OPT_INSTANA_DIR}"
    fi
    if [[ ${ARTIFACT_VERSION} != 'local' ]]; then
      COMMIT_ID=$(cat "${COMPONENT_OPT_INSTANA_DIR}/target/assets/build.json" | jq -r '.revision')
    fi
  else
    _log_error "Cannot find file: ${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz."
    exit 1
  fi
}

function _get_base_version {
  source "${SCRIPTPATH}/base-version.sh"
}

function _run_docker_build {
  local TAG=$1
  local PATH_TO_CONTAINER_FILE=$2
  local DESIRED_IMAGE_VERSION=$3
  local TARGET_OVERRIDE=${4:-'none'}
  _log_info "Building image ${TAG}"

  local REGISTRY_USERNAME
  local REGISTRY_PASSWORD

  if [[ ${ARTIFACT_VERSION} == 'local' ]]; then
    REGISTRY_AUTH=$(yarn config get '//delivery.instana.io/artifactory/api/npm/int-npm-virtual/:_auth' | base64 -d)
    IFS=':' read -r REGISTRY_USERNAME REGISTRY_PASSWORD <<< "$REGISTRY_AUTH"
  else
    REGISTRY_USERNAME=${INSTANA_ARTIFACTORY_USERNAME}
    REGISTRY_PASSWORD=${INSTANA_ARTIFACTORY_PASSWORD}
  fi

  docker build \
    --build-arg base_version=${BASE_VERSION} \
    --build-arg component_name=${COMPONENT_NAME} \
    --build-arg image_version=${DESIRED_IMAGE_VERSION} \
    --build-arg branch=${BRANCH_NAME} \
    --build-arg commit_id=${COMMIT_ID} \
    --build-arg registry='https://delivery.instana.io' \
    --build-arg repository_key='int-npm-virtual' \
    --build-arg registry_username=${REGISTRY_USERNAME} \
    --build-arg registry_password=${REGISTRY_PASSWORD} \
    -f ${PATH_TO_CONTAINER_FILE} \
    -t ${TAG} \
    ${COMPONENT_CONTAINER_DIR}
}

function _scan_image() {
  local TAG=$1
  local INSTANA_TWISTCLI_VERSION='1.1.5'
  _log_info "Triggering scan for image ${TAG} with instana-twistcli ${INSTANA_TWISTCLI_VERSION}"

  if [[ -f ${COMPONENT_TWISTLOCK_IGNOREFILE} ]]; then
    MIN_VULN_SEVERITY=high \
      IGNOREFILE=${COMPONENT_TWISTLOCK_IGNOREFILE} \
      ${UI_CLIENT_ROOT_DIR}/build/ci-shared-tools/scripts/instana-twistcli/scanImage.bash ${TAG} ${INSTANA_TWISTCLI_VERSION}
  else
    MIN_VULN_SEVERITY=high \
      ${UI_CLIENT_ROOT_DIR}/build/ci-shared-tools/scripts/instana-twistcli/scanImage.bash ${TAG} ${INSTANA_TWISTCLI_VERSION}
  fi
}

function build_image {
  _check_prerequisites
  _check_branch_name
  _create_necessary_dirs
  _get_container_file
  _get_run_sh
  _get_component_tar_gz
  _extract_component_tar_gz
  _get_base_version
  _docker_login

  _run_docker_build ${FULLY_QUALIFIED_TAG} ${CONTAINER_FILE} ${IMAGE_VERSION}

  # Disabled, on Nov, 15th, after discussing - because it currently fails and
  # blocks and deployment on test-environment, caused by this problem:
  #  curl: (35) OpenSSL SSL_connect: Connection reset by peer in connection to w3twistlock.sos.ibm.com:443
  #
  #
  # Ideally, before starting building the release(-branch), this needs
  # to be fixed and reactivated!
  # _scan_image ${FULLY_QUALIFIED_TAG}
}

build_image
