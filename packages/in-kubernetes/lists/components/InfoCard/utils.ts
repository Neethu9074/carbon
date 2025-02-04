/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { combineLatest, Observable } from '@instana/observables';

import {
  getKubernetesNodesData,
  getKubernetesPodsData,
  getWorkloadData
} from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import { KubernetesNodeListItem, KubernetesWorkloadControllerListItem, Result, TimeConfig } from 'in-types';
import getKubernetesDeployments from 'in-kubernetes/subscriptions/getKubernetesDeployments';

interface Props {
  timeConfig: TimeConfig;
  clusterId: string;
}

interface AdditionalProps {
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
}
const resultTransformer = (result: Result<any>) => result?.data;
const resultTransformerToItems = (result: Result<any>) => result?.data?.items;

function getKubernetesPods({ timeConfig, clusterId, phase = 'Running' }: Props & { phase?: string }) {
  return !clusterId
    ? null
    : getKubernetesPodsData({
        timeConfig,
        clusterId,
        phase
      }).map(resultTransformer);
}

function getKubernetesNodes({
  timeConfig,
  clusterId,
  pageSize = 200,
  orderBy = 'health',
  orderDirection = 'DESC'
}: Props & AdditionalProps) {
  return !clusterId
    ? null
    : getKubernetesNodesData({
        timeConfig,
        clusterId,
        pageSize,
        orderBy,
        orderDirection
      }).map(resultTransformerToItems);
}

function getWorkloadCounters({
  timeConfig,
  clusterId,
  pageSize = 200,
  orderBy = 'health',
  orderDirection = 'DESC',
  getWorkloadControllers$ = getKubernetesDeployments
}: Props &
  AdditionalProps & {
    getWorkloadControllers$?: (params: unknown) => Observable<Result<any>>;
  }) {
  return !clusterId
    ? null
    : getWorkloadData({
        timeConfig,
        clusterId,
        pageSize,
        orderBy,
        orderDirection,
        getWorkloadControllers$
      }).map(resultTransformerToItems);
}

export function getKubernetesCounters({ clusterId, timeConfig }: Props) {
  return combineLatest([
    getKubernetesPods({ clusterId, timeConfig }),
    getKubernetesNodes({ clusterId, timeConfig }),
    getWorkloadCounters({ clusterId, timeConfig })
  ])
    .throttle(500)
    .map(([pods, nodes, deployments]: any) => ({
      totalRunningPods: pods?.totalHits ?? 0,
      ...getNodesInfo(nodes),
      ...getDeploymentsInfo(deployments)
    }));
}

function getNodesInfo(nodes: KubernetesNodeListItem[]) {
  if (!Array.isArray(nodes)) {
    return {
      totalNodesIssues: 0,
      hasNodesWithOnlyWarnings: false
    };
  }

  const totalNodesIssues = nodes.filter(
    (node: KubernetesNodeListItem) => node?.entityHealthInfo?.openIssues?.length > 0
  ).length;

  const hasNodesWithOnlyWarnings =
    nodes.filter((node: KubernetesNodeListItem) => node?.entityHealthInfo?.maxSeverity === 5).length ===
      totalNodesIssues && totalNodesIssues !== 0;

  return {
    totalNodesIssues,
    hasNodesWithOnlyWarnings
  };
}

function getDeploymentsInfo(deployments: KubernetesWorkloadControllerListItem[]) {
  if (!Array.isArray(deployments)) {
    return {
      totalDeploymentsIssues: 0,
      hasDeploymentsWithOnlyWarnings: false
    };
  }

  const totalDeploymentsIssues = deployments.filter(
    (deployment: KubernetesWorkloadControllerListItem) => deployment?.entityHealthInfo?.openIssues?.length > 0
  ).length;

  const hasDeploymentsWithOnlyWarnings =
    deployments.filter(
      (deployment: KubernetesWorkloadControllerListItem) => deployment?.entityHealthInfo?.maxSeverity === 5
    ).length === totalDeploymentsIssues && totalDeploymentsIssues !== 0;

  return {
    totalDeploymentsIssues,
    hasDeploymentsWithOnlyWarnings
  };
}
