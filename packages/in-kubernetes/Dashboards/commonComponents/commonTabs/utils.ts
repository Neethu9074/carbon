/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { KubernetesQueryFilter, Result } from '@instana/types';

import getKubernetesNodes from 'in-kubernetes/subscriptions/getKubernetesNodes';
import getOtelKubernetesNodes from 'in-kubernetes/subscriptions/getOtelKubernetesNodes';
import getKubernetesPods from 'in-kubernetes/subscriptions/getKubernetesPods';
import { getInfraGranularity } from 'in-stores/metric/metric';

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
  });
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
