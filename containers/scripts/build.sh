#!/bin/bash

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

function _cleanup_container_dir {
  _log_info "Removing ${COMPONENTS_HOME_DIR}/.container*"
  rm -rf "${COMPONENTS_HOME_DIR}/.container"*
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

function _create_etc_instana_dir {
  mkdir -p ${COMPONENT_ETC_INSTANA_DIR}
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
  if [[ ${VERSION} == 'local' ]]; then
      _log_info "Building ${COMPONENT_NAME} tar.gz locally"
      pushd "${UI_CLIENT_ROOT_DIR}"
      cd packages/in-server && yarn --prod && cd ../..
      yarn run build
      FAIL_ON_DELIVERY_BRANCH=true ./build/ci-shared-tools/scripts/isDeliveryBranch.js || yarn run test:compression
      tar -czf "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz" target/*
      popd
  else
      _log_info "Downloading ${COMPONENT_TAR_GZ_URL} into ${COMPONENT_WORK_DIR}"
      curl -u ${ARTIFACT_INSTANA_IO_USER}:${ARTIFACT_INSTANA_IO_PASSWORD} ${COMPONENT_TAR_GZ_URL} \
           --keepalive-time 5 \
           --output "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz"
  fi
}

function _extract_component_tar_gz {
  if [[ -f "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz" ]]; then
    _create_opt_instana_dir
    _create_etc_instana_dir

    _log_info "Extracting ${COMPONENT_NAME}.tar.gz"
    tar xfz "${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz" -C "${COMPONENT_OPT_INSTANA_DIR}"
    if [[ ${VERSION} != 'local' ]]; then
      COMMIT_ID=$(cat "${COMPONENT_OPT_INSTANA_DIR}/target/assets/build.json" | jq -r '.revision')
    fi
  else
    _log_error "Cannot find file: ${COMPONENT_WORK_DIR}/${COMPONENT_NAME}.tar.gz."
    exit 1
  fi
}

function _install_production_binaries {
  _log_info "Installing production binaries"

  # Get nodejs using the same version as ../container
  docker create -t --name tmp-nodejs containers.instana.io/instana/product/nodejs:0.0.6
  docker cp tmp-nodejs:/opt/instana/nodejs "${OPT_INSTANA_DIR}"
  docker rm -f tmp-nodejs

  # Run 'npm install --production' in context of centos to ensure that
  # the same binaries will function on centos and ubuntu
  docker build \
    --build-arg nodejs_bin=/opt/instana/nodejs/bin \
    -f "${SCRIPTPATH}/container.binaries" \
    -t ui-client-centos \
    ${COMPONENT_CONTAINER_DIR}

  # Remove existing files in local /opt/instana and replace ui-client
  # files with the ones from ui-client-centos container
  rm -rf ${OPT_INSTANA_DIR}/*
  docker create -t --name ui-client-centos ui-client-centos
  docker cp ui-client-centos:/opt/instana/ui-client/target ${COMPONENT_OPT_INSTANA_DIR}

  if [[ ${CONTAINER_IMAGE_NAME} == 'ui-client' ]]; then
    _log_info "Removing *.map files for ${CONTAINER_IMAGE_NAME}"
    find ${COMPONENT_OPT_INSTANA_DIR} -name "*.map" -delete
  fi
  docker rm -f ui-client-centos
  docker rmi -f ui-client-centos
}

function build_image {
  _check_prerequisites
  _check_branch_name
  _create_necessary_dirs
  _get_container_file
  _get_run_sh
  _get_component_tar_gz
  _extract_component_tar_gz
  _install_production_binaries
  _docker_login

  TAG=$1
  docker build \
    --build-arg component_name=${COMPONENT_NAME} \
    --build-arg version=${CONTAINER_VERSION} \
    --build-arg iteration=${ITERATION} \
    --build-arg branch=${BRANCH_NAME} \
    --build-arg commit_id=${COMMIT_ID} \
    -f ${CONTAINER_FILE} \
    -t ${TAG} \
    ${COMPONENT_CONTAINER_DIR}

  _cleanup_container_dir
}

build_image "${FULLY_QUALIFIED_TAG}"
