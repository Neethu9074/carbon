/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';
import { get } from 'lodash';

import { TimeConfig } from '@instana/types';

import getOtelKubernetesIdsForBreadcrumb$ from 'in-kubernetes/subscriptions/getOtelKubernetesIdsForBreadcrumb';
// @ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';

interface KubernetesIdsForBreadcrumbProps {
  clusterId?: string;
  nodeId?: string;
  podId?: string;
  containerId?: string;
  timeConfig: TimeConfig;
  renderBreadcrumbs: (clusterId?: string, nodeId?: string, podId?: string, containerId?: string) => ReactNode;
  resolvedIdsResult?: {
    data?: {
      clusterId?: string;
      nodeId?: string;
      podId?: string;
      containerId?: string;
      namespaceId?: string;
      workloadControllerId?: string;
      workloadControllerType?: string;
    };
  };
}

function KubernetesIdsForBreadcrumb(props: KubernetesIdsForBreadcrumbProps): ReactNode {
  return props.renderBreadcrumbs(
    get(props.resolvedIdsResult, ['data', 'clusterId']),
    get(props.resolvedIdsResult, ['data', 'nodeId']),
    get(props.resolvedIdsResult, ['data', 'podId']),
    get(props.resolvedIdsResult, ['data', 'containerId'])
  );
}

// Using any for connectTo generic types since we don't have the exact type definitions
export default connectTo(
  (props: KubernetesIdsForBreadcrumbProps) => ({
    resolvedIdsResult: getOtelKubernetesIdsForBreadcrumb$({
      filter: {
        clusterId: props.clusterId,
        nodeId: props.nodeId,
        podId: props.podId,
        containerId: props.containerId,
        timeConfig: props.timeConfig
      }
    })
  }),
  KubernetesIdsForBreadcrumb
);
