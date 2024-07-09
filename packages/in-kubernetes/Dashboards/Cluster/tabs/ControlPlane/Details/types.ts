/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ReactNode } from 'react';

import { KubernetesCluster, TimeConfig } from '@instana/types';

export interface Item {
  key: string;
  value: string;
}

export interface DetailsListProps {
  clusterInfos: Item[];
  clusterId?: string;
}

export interface DetailsProps extends DetailsListProps {
  clusterId: KubernetesCluster['id'];
  timeConfig: TimeConfig;
}

export interface InfosProps {
  label: string;
  value?: string | ReactNode;
  hasCopyToClipboard?: boolean;
  nodeValue?: ReactNode;
}
