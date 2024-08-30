/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { KubernetesCluster, TimeConfig } from '@instana/types';

export interface EtcdProps {
  clusterId: KubernetesCluster['id'];
  timeConfig: TimeConfig;
}

export interface ChartProps {
  snapshotId: string;
  timeConfig: TimeConfig;
  clusterVersion?: number;
}
