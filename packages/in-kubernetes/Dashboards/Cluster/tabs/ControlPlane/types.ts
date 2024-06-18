/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { KubernetesCluster, TimeConfig } from '@instana/types';

export interface ControlPlaneProps {
  data: KubernetesCluster;
  timeConfig: TimeConfig;
}
