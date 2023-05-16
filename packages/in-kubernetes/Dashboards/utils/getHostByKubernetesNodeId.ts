/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { fromJS } from 'immutable';

import getHostByKubernetesNode from 'in-kubernetes/subscriptions/getHostByKubernetesNode';
import { TimeConfig } from 'in-types';

interface Props {
  nodeId: string;
  timeConfig: TimeConfig;
}

export default function getHostByKubernetesNodeId({ nodeId, timeConfig }: Props) {
  if (!nodeId && !timeConfig) {
    return;
  }

  const result = getHostByKubernetesNode({
    filter: {
      nodeId,
      timeConfig
    }
  }).map(host => {
    if (!host || !host.data) {
      return host;
    }
    return {
      ...host,
      data: fromJS(host.data)
    };
  });

  return result;
}
