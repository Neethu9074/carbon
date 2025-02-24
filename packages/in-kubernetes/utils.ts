/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { KubernetesClusterListItem, KubernetesNamespaceListItem } from '@instana/types';

import {
  clusterList as pathClusterSegment,
  namespaceList as pathNamespaceSegment
} from 'in-kubernetes/navigation/paths';
import { plugins } from 'in-forge/constants';

export const name = 'name';
export const unhealthyNodes = 'unhealthyNodes';
export const unhealthyDeployments = 'unhealthyDeployments';
export const runningPods = 'runningPods';
export const namespaces = 'namespaces';
export const services = 'services';
export const cronJobs = 'cronJobs';

export type ItemAdditionalInfo = Record<string, any>;
export interface FilterProps extends Pick<OrderProps, 'orderBy' | 'orderDirection'> {
  query: string;
}
interface OrderProps {
  orderBy: string;
  orderDirection: string;
  itemsAdditionalInfo: ItemAdditionalInfo;
}

export const getUrlStateDefinition = (isClusterPage: boolean) => {
  const pathSegment = isClusterPage ? pathClusterSegment : pathNamespaceSegment;

  return {
    bind: [
      createUrlParameter(pathSegment, 'query', ''),
      createUrlParameter(pathSegment, 'orderBy', 'name'),
      createUrlParameter(pathSegment, 'orderDirection', 'ASC')
    ],
    resets: [
      {
        bind: [
          createUrlParameter(pathSegment, 'orderBy', 'name'),
          createUrlParameter(pathSegment, 'orderDirection', 'ASC')
        ],
        reset: {}
      }
    ]
  };
};

export function getContainerIconByPlugin(plugin: string) {
  if (plugin === plugins.containerd) {
    return 'lib_container_containerd';
  } else if (plugin === plugins.crio) {
    return 'lib_container_crio';
  }
  return 'lib_container_docker';
}

export function getIcon(workloadType: string) {
  if (!workloadType) {
    return 'lib_kubernetes_workload';
  }

  if (workloadType.includes('deployment')) {
    return 'lib_infra_kubernetesDeployment';
  }

  if (workloadType.includes('daemonset')) {
    return 'lib_infra_kubernetesDaemonSet';
  }

  if (workloadType.includes('statefulset')) {
    return 'lib_infra_kubernetesStatefulSet';
  }

  return 'lib_kubernetes_workload';
}

export function sortBy({ orderBy, orderDirection, itemsAdditionalInfo }: OrderProps) {
  return (
    current: KubernetesClusterListItem | KubernetesNamespaceListItem,
    next: KubernetesClusterListItem | KubernetesNamespaceListItem
  ) => {
    const [currentId, currentLabel] = getLabelAndId(current);
    const [nextId, nextLabel] = getLabelAndId(next);

    // Sort by name
    if (orderBy === name) return sortByName({ orderDirection, currentLabel, nextLabel });

    // Sort by workloads
    const workloads = 'cluster' in current ? [services, namespaces, cronJobs] : [services];
    if (workloads.includes(orderBy)) {
      return sortByWorkloads(orderDirection, current, next, orderBy);
    }

    // Sort by other properties
    if ([unhealthyNodes, unhealthyDeployments, runningPods, cronJobs].includes(orderBy)) {
      return sortByOtherProperties({
        orderBy,
        orderDirection,
        itemsAdditionalInfo,
        currentId,
        nextId
      });
    }

    return -1;
  };
}

export function sortByName({
  orderDirection,
  currentLabel,
  nextLabel
}: Pick<OrderProps, 'orderDirection'> & { currentLabel: string; nextLabel: string }) {
  if (currentLabel === nextLabel) return 0;
  if (currentLabel < nextLabel) return orderDirection === 'ASC' ? -1 : 1;
  if (currentLabel > nextLabel) return orderDirection === 'ASC' ? 1 : -1;
  return 0;
}

function sortByOtherProperties({
  orderBy,
  orderDirection,
  itemsAdditionalInfo,
  currentId,
  nextId
}: OrderProps & { currentId: string; nextId: string }) {
  const getAdditionalInfoItemById = getAdditionalInfoItem(itemsAdditionalInfo);
  const currentItem = getAdditionalInfoItemById(currentId);
  const nextItem = getAdditionalInfoItemById(nextId);
  const orderByKey = `total${orderBy?.[0].toUpperCase() + orderBy.slice(1)}`;
  return orderDirection === 'ASC'
    ? Number(currentItem?.[orderByKey]) - Number(nextItem?.[orderByKey])
    : Number(nextItem?.[orderByKey]) - Number(currentItem?.[orderByKey]);
}

const getAdditionalInfoItem = (itemsAdditionalInfo: ItemAdditionalInfo) => (id: string) => {
  if (!id) return undefined;
  return itemsAdditionalInfo[id];
};

function createUrlParameter(pathSegment: string, matrixPrefix: string, initialState: string) {
  return {
    path: pathSegment,
    name: matrixPrefix,
    as: matrixPrefix,
    initialState
  };
}

const getLabelAndId = (item: KubernetesClusterListItem | KubernetesNamespaceListItem) => {
  const hasClusterProperty = 'cluster' in item;
  const id = hasClusterProperty ? item.cluster.id : item.namespace.id;
  const label = hasClusterProperty ? item.cluster.label : item.namespace.label;
  return [id, label];
};

const sortByWorkloads = (
  orderDirection: string,
  current: KubernetesClusterListItem | KubernetesNamespaceListItem,
  next: KubernetesClusterListItem | KubernetesNamespaceListItem,
  orderBy: string
) => {
  const hasClusterProperty = 'cluster' in current && 'cluster' in next;

  if (hasClusterProperty) {
    if (orderBy === 'namespaces') {
      return orderDirection === 'ASC' ? current.namespaces - next.namespaces : next.namespaces - current.namespaces;
    }

    if (orderBy === 'cronJobs') {
      return orderDirection === 'ASC' ? current.cronJobs - next.cronJobs : next.cronJobs - current.cronJobs;
    }
  }

  if (orderBy === 'services') {
    return orderDirection === 'ASC' ? current.services - next.services : next.services - current.services;
  }

  return 0;
};
