import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';
import { bytes } from 'in-services/formatters/number';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

export default function Pods({ timeConfig, namespaceId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Pods"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      namespaceId={namespaceId}
      paginationResettingProps={['namespaceId', 'timeConfig']}
      defaultOrderBy="label"
      defaultOrderDirection="DESC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, namespaceId }) {
  return getKubernetesPods({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      'cpu.requested': {
        metric: 'cpu.requested',
        aggregation: 'SUM'
      },
      'cpu.limits': {
        metric: 'cpu.limits',
        aggregation: 'SUM'
      },
      'memory.requested': {
        metric: 'memory.requested',
        aggregation: 'SUM'
      },
      'memory.limits': {
        metric: 'memory.limits',
        aggregation: 'SUM'
      },
      restarts: {
        metric: 'restarts',
        aggregation: 'SUM'
      }
    },
    filter: {
      label: query,
      namespaceId,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return <EntityLink icon="lib_kubernetes_pod" label={item.label} href$={getPodDashboard(item.id)} />;
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent() {
      return 'undefined';
    }
  },
  {
    id: 'cpuReq',
    label: 'CPU requests',
    getContent(item) {
      return `${item.metrics['cpu.requested']} cores`;
    }
  },
  {
    id: 'cpuLimits',
    label: 'CPU limits',
    getContent(item) {
      return `${item.metrics['cpu.limits']} cores`;
    }
  },
  {
    id: 'memoryReq',
    label: 'Memory requests',
    getContent(item) {
      return bytes.compact(item.metrics['memory.requested']);
    }
  },
  {
    id: 'memoryReq',
    label: 'Memory limits',
    getContent(item) {
      return bytes.compact(item.metrics['memory.limits']);
    }
  },
  {
    id: 'restarts',
    label: 'Restarts',
    getContent(item) {
      return item.metrics.restarts;
    }
  },
  {
    id: 'age',
    label: 'Age',
    getContent() {
      return 42;
    }
  }
];
