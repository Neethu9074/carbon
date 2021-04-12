#!/bin/bash

set -euo pipefail
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

source "${SCRIPTPATH}/shared.sh"

function _remove_from_local_registry {
  _log_info "Removing $1 from local registry"
  docker rmi -f $1
}

function push_image {
  if [[ ${VERSION} == 'local' ]]; then
    _log_info "Images built locally will not be pushed to the remote registry"
    exit 0
  else
    _check_branch_name
    _docker_login
    _log_info "Pushing image $1"
    docker push $1
    _remove_from_local_registry $1
  fi
}

push_image "${FULLY_QUALIFIED_TAG}"
