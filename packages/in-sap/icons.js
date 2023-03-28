/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { plugins } from 'in-forge/constants';

export function getContainerIconByPlugin(plugin) {
  if (plugin === plugins.containerd) {
    return 'lib_container_containerd';
  } else if (plugin === plugins.crio) {
    return 'lib_container_crio';
  }
  return 'lib_container_docker';
}
