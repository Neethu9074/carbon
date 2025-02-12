/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { KubernetesClusterListItem } from '@instana/types';

import { clusterList as pathSegment } from 'in-kubernetes/navigation/paths';
import { plugins } from 'in-forge/constants';

export const name = 'name';
export const unhealthyNodes = 'unhealthyNodes';
export const unhealthyDeployments = 'unhealthyDeployments';
export const runningPods = 'runningPods';
export const namespaces = 'namespaces';
export const services = 'services';
export const cronJobs = 'cronJobs';

export type ItemAdditionalInfo = Record<string, any>;

interface OrderProps {
  orderBy: string;
  orderDirection: string;
  itemsAdditionalInfo: ItemAdditionalInfo;
}

interface Elements {
  current: KubernetesClusterListItem;
  next: KubernetesClusterListItem;
}

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
  return (current: KubernetesClusterListItem, next: KubernetesClusterListItem) => {
    // Sort by name
    if (orderBy === name) return sortByName({ orderDirection, current, next });

    // Sort by namespaces, services or cronjobs.
    if (orderBy === namespaces || orderBy === services || orderBy === cronJobs) {
      return orderDirection === 'ASC' ? current?.[orderBy] - next?.[orderBy] : next?.[orderBy] - current?.[orderBy];
    }

    // Sort by unhealthy nodes, unhealthy deployments or running pods
    if (orderBy === unhealthyNodes || orderBy === unhealthyDeployments || orderBy === runningPods) {
      return sortByOtherProperties({ orderBy, orderDirection, itemsAdditionalInfo, current, next });
    }

    return -1;
  };
}

export function sortByName({ orderDirection, current, next }: Pick<OrderProps, 'orderDirection'> & Elements) {
  const currentName = current.name ?? '';
  const nextName = next.name ?? '';
  if (currentName === nextName) return 0;
  if (currentName < nextName) return orderDirection === 'ASC' ? -1 : 1;
  if (currentName > nextName) return orderDirection === 'ASC' ? 1 : -1;
  return 0;
}

function sortByOtherProperties({ orderBy, orderDirection, itemsAdditionalInfo, current, next }: OrderProps & Elements) {
  const getAdditionalInfoItemById = getAdditionalInfoItem(itemsAdditionalInfo);

  const currentItem = getAdditionalInfoItemById(current.cluster.id);
  const nextItem = getAdditionalInfoItemById(next.cluster.id);
  const orderByKey = `total${orderBy?.[0].toUpperCase() + orderBy.slice(1)}`;

  return orderDirection === 'ASC'
    ? Number(currentItem?.[orderByKey]) - Number(nextItem?.[orderByKey])
    : Number(nextItem?.[orderByKey]) - Number(currentItem?.[orderByKey]);
}

const getAdditionalInfoItem = (itemsAdditionalInfo: ItemAdditionalInfo) => (id: string) => {
  if (!id) return undefined;
  return itemsAdditionalInfo[id];
};

export const urlStateDefinition = {
  bind: [
    {
      path: pathSegment,
      name: 'query',
      as: 'query',
      initialState: ''
    },
    {
      path: pathSegment,
      name: 'orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: pathSegment,
      name: 'orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    }
  ],
  resets: [
    {
      bind: [
        {
          path: pathSegment,
          name: 'orderBy'
        },
        {
          path: pathSegment,
          name: 'orderDirection'
        }
      ],
      reset: {}
    }
  ]
};
