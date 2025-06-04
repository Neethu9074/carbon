/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { KubernetesNodeListItem, KubernetesWorkloadControllerListItem, Result, TimeConfig } from '@instana/types';
import { combineLatest, Observable } from '@instana/observables';

import {
  getKubernetesNodesData,
  getKubernetesPodsData,
  getWorkloadData
} from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import getKubernetesNamespaceItemCounters from 'in-kubernetes/subscriptions/getKubernetesNamespaceItemCounters';
import getKubernetesDeployments from 'in-kubernetes/subscriptions/getKubernetesDeployments';

interface Props {
  type?: string;
  timeConfig: TimeConfig;
  clusterId?: string;
  namespaceId?: string;
}

interface AdditionalProps {
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
}
const resultTransformer = (result: Result<any>) => result?.data;
const resultTransformerToItems = (result: Result<any>) => result?.data?.items;

function getKubernetesPods({ timeConfig, clusterId, namespaceId, phase = 'Running' }: Props & { phase?: string }) {
  return getKubernetesPodsData({
    timeConfig,
    clusterId,
    namespaceId,
    phase
  }).map(resultTransformer);
}

function getKubernetesNodes({
  timeConfig,
  clusterId,
  namespaceId,
  pageSize = 200,
  orderBy = 'health',
  orderDirection = 'DESC'
}: Props & AdditionalProps) {
  return getKubernetesNodesData({
    timeConfig,
    clusterId,
    namespaceId,
    pageSize,
    orderBy,
    orderDirection
  }).map(resultTransformerToItems);
}

function getWorkloadCounters({
  timeConfig,
  clusterId,
  namespaceId,
  pageSize = 200,
  orderBy = 'health',
  orderDirection = 'DESC',
  getWorkloadControllers$ = getKubernetesDeployments
}: Props &
  AdditionalProps & {
    getWorkloadControllers$?: (params: unknown) => Observable<Result<any>>;
  }) {
  return getWorkloadData({
    timeConfig,
    clusterId,
    namespaceId,
    pageSize,
    orderBy,
    orderDirection,
    getWorkloadControllers$
  }).map(resultTransformerToItems);
}

export function getKubernetesCounters(params: Props) {
  const events = [getKubernetesPods(params), getKubernetesNodes(params), getWorkloadCounters(params)];
  if (params?.namespaceId) {
    events.push(getKubernetesNamespaceItemCounters(params).map(resultTransformer));
  }
  return combineLatest(events)
    .throttle(500)
    .map(([pods, nodes, deployments, namespaces, containers]: any) => ({
      totalRunningPods: pods?.totalHits ?? 0,
      totalCronJobs: namespaces?.cronJobs,
      totalContainers: containers?.totalHits ?? 0,
      ...getNodesInfo(nodes),
      ...getDeploymentsInfo(deployments)
    }));
}

function getNodesInfo(nodes: KubernetesNodeListItem[]) {
  if (!Array.isArray(nodes)) {
    return {
      totalUnhealthyNodes: 0,
      hasNodesWithOnlyWarnings: false
    };
  }

  const totalUnhealthyNodes = nodes.filter(
    (node: KubernetesNodeListItem) => node?.entityHealthInfo?.openIssues?.length > 0
  ).length;

  const hasNodesWithOnlyWarnings =
    nodes.filter((node: KubernetesNodeListItem) => node?.entityHealthInfo?.maxSeverity === 5).length ===
      totalUnhealthyNodes && totalUnhealthyNodes !== 0;

  return {
    totalUnhealthyNodes,
    hasNodesWithOnlyWarnings
  };
}

function getDeploymentsInfo(deployments: KubernetesWorkloadControllerListItem[]) {
  if (!Array.isArray(deployments)) {
    return {
      totalUnhealthyDeployments: 0,
      hasDeploymentsWithOnlyWarnings: false
    };
  }

  const totalUnhealthyDeployments = deployments.filter(
    (deployment: KubernetesWorkloadControllerListItem) => deployment?.entityHealthInfo?.openIssues?.length > 0
  ).length;

  const hasDeploymentsWithOnlyWarnings =
    deployments.filter(
      (deployment: KubernetesWorkloadControllerListItem) => deployment?.entityHealthInfo?.maxSeverity === 5
    ).length === totalUnhealthyDeployments && totalUnhealthyDeployments !== 0;

  return {
    totalUnhealthyDeployments,
    hasDeploymentsWithOnlyWarnings
  };
}
