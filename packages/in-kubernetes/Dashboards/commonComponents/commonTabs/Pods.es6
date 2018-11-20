import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { bytes } from 'in-services/formatters/number';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

export default function Pods({ timeConfig, namespaceId, clusterId, deploymentId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Pods"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      namespaceId={namespaceId}
      deploymentId={deploymentId}
      clusterId={clusterId}
      paginationResettingProps={['namespaceId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
  timeConfig,
  namespaceId,
  clusterId,
  deploymentId
}) {
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
      deploymentId,
      clusterId,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item, { clusterId, namespaceId, deploymentId }) {
      return (
        <EntityLink
          icon="lib_kubernetes_pod"
          label={get(item, ['pod', 'label'])}
          href$={getPodDashboard(get(item, ['pod', 'id']), { clusterId, namespaceId, deploymentId })}
        />
      );
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return get(item, ['pod', 'status']);
    }
  },
  {
    id: 'cpuReq',
    label: 'CPU requests',
    getContent(item) {
      return `${get(item, ['pod', 'cpu.requested'])} cores`;
    }
  },
  {
    id: 'cpuLimits',
    label: 'CPU limits',
    getContent(item) {
      return `${get(item, ['pod', 'cpu.limis'])} cores`;
    }
  },
  {
    id: 'memoryReq',
    label: 'Memory requests',
    getContent(item) {
      return bytes.compact(get(item, ['pod', 'memory.requested']));
    }
  },
  {
    id: 'memoryLimits',
    label: 'Memory limits',
    getContent(item) {
      return bytes.compact(get(item, ['pod', 'memory.limits']));
    }
  },
  {
    id: 'restarts',
    label: 'Restarts',
    getContent(item) {
      return get(item, ['pod', 'restarts']);
    }
  },
  {
    id: 'age',
    label: 'Age',
    getContent(item) {
      return item.age;
    }
  }
];
