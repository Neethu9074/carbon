/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  KubernetesPodListItem,
  KubernetesCondition,
  KubernetesQueryFilter,
  Result,
  KubernetesPod,
  PaginatedResult,
  EntityHealthInfo
} from '@instana/types';

import getOtelKubernetesNodes from 'in-kubernetes/subscriptions/getOtelKubernetesNodes';
import getOtelKubernetesPods from 'in-kubernetes/subscriptions/getOtelKubernetesPods';
import getKubernetesNodes from 'in-kubernetes/subscriptions/getKubernetesNodes';
import getKubernetesPods from 'in-kubernetes/subscriptions/getKubernetesPods';
import { getInfraGranularity } from 'in-stores/metric/metric';

interface GetHealthyStatusProps extends Omit<KubernetesPodListItem, 'pod'> {
  statusSummary: string;
  podConditions: KubernetesCondition[];
}

export function getHealthyStatus({
  podConditions,
  entityHealthInfo: { openIssues, maxSeverity: baseMaxSeverity },
  statusSummary
}: GetHealthyStatusProps) {
  const statusSuccess = ['running', 'completed', 'pending', 'created', 'started', 'succeeded'];
  const isOpenIssues = (typeof openIssues === 'number' && openIssues === 0) || openIssues.length === 0;
  const isStatusDefined = statusSuccess.includes(statusSummary?.toLowerCase());
  const isStatusCompleted = statusSummary?.toLocaleLowerCase() === 'completed';

  const isConditionStatusFalseFound = podConditions?.some(
    (condition: KubernetesCondition) => condition.status.toLowerCase() === 'false'
  );

  const isNotHealthy = (isOpenIssues && !isStatusDefined) || (isConditionStatusFalseFound && !isStatusCompleted);

  const openIssuesCount = isNotHealthy ? 1 : openIssues.length ?? openIssues;
  const maxSeverity = isNotHealthy ? 10 : baseMaxSeverity;

  return {
    openIssuesCount,
    maxSeverity
  };
}

interface KubernetesQuery {
  query?: string;
  orderBy?: string;
  orderDirection?: string;
  page?: number;
  pageSize?: number;
}

interface GetKubernetesPodsData extends KubernetesQueryFilter, KubernetesQuery {}

export function getKubernetesPodsData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'health',
  orderDirection = 'DESC',
  timeConfig,
  namespaceId,
  clusterId,
  serviceId,
  workloadControllerId,
  nodeId,
  cronJobId,
  phase
}: GetKubernetesPodsData) {
  return getKubernetesPods({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      namespaceId,
      workloadControllerId,
      clusterId,
      serviceId,
      nodeId,
      cronJobId,
      timeConfig,
      phase
    },
    granularity: getInfraGranularity(timeConfig)
  }).map(props => sortByHealthIssues({ result: props, orderBy, orderDirection }));
}

interface SortByHealthIssues extends Pick<KubernetesQuery, 'orderBy' | 'orderDirection'> {
  result: Result<PaginatedResult<KubernetesPod>>;
}

function sortByHealthIssues({ result, orderBy, orderDirection }: SortByHealthIssues) {
  if (!result?.data?.items || orderBy !== 'health') return result;
  const multiplier = orderDirection === 'ASC' ? -1 : 1;
  const getItemsWithHealthInfo = (item: any) => {
    const {
      pod: { conditions: podConditions },
      entityHealthInfo,
      statusSummary
    } = item;

    const { maxSeverity, openIssuesCount } = getHealthyStatus({
      podConditions,
      entityHealthInfo,
      statusSummary
    });

    return {
      ...item,
      entityHealthInfo: {
        ...entityHealthInfo,
        maxSeverity,
        openIssuesCount
      }
    };
  };

  interface EntityHealthInfoPod extends EntityHealthInfo {
    openIssuesCount: number;
  }

  interface KubernetesPodItem extends KubernetesPodListItem {
    entityHealthInfo: EntityHealthInfoPod;
  }

  const compareHealthInfo = (a: KubernetesPodItem, b: KubernetesPodItem) => {
    if (a.entityHealthInfo.maxSeverity !== b.entityHealthInfo.maxSeverity) {
      return (b.entityHealthInfo.maxSeverity - a.entityHealthInfo.maxSeverity) * multiplier;
    }
    return (b.entityHealthInfo.openIssuesCount - a.entityHealthInfo.openIssuesCount) * multiplier;
  };

  const sortedPods = [...result.data.items].map(getItemsWithHealthInfo).sort(compareHealthInfo);

  return {
    ...result,
    data: {
      ...result.data,
      items: sortedPods
    }
  };
}

interface GetKubernetesNodesQuery extends KubernetesQueryFilter, KubernetesQuery {}

export function getKubernetesNodesData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'type',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  workloadControllerId
}: GetKubernetesNodesQuery) {
  return getKubernetesNodes({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      workloadControllerId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}

interface GetOtelKubernetesNodesQuery extends KubernetesQueryFilter, KubernetesQuery {}

export function getOtelKubernetesNodesData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'type',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  workloadControllerId
}: GetOtelKubernetesNodesQuery) {
  return getOtelKubernetesNodes({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      workloadControllerId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}

interface GetOtelKubernetesPodsQuery extends KubernetesQueryFilter, KubernetesQuery {}

export function getOtelKubernetesPodsData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'health',
  orderDirection = 'DESC',
  timeConfig,
  clusterId,
  workloadControllerId
}: GetOtelKubernetesPodsQuery) {
  return getOtelKubernetesPods({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      workloadControllerId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}

interface GetKubernetesWorkloadQuery extends KubernetesQueryFilter, KubernetesQuery {
  resultTransformer?: (result: Result<any>) => any;
  getWorkloadControllers$?: any;
}

export function getWorkloadData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'health',
  orderDirection = 'DESC',
  timeConfig,
  clusterId,
  namespaceId,
  serviceId,
  getWorkloadControllers$,
  resultTransformer = (result: Result<any>) => result
}: GetKubernetesWorkloadQuery) {
  return getWorkloadControllers$({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      namespaceId,
      clusterId,
      serviceId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  }).map(resultTransformer);
}
