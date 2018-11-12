import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesServices from 'in-subscription/kubernetes/getKubernetesServices';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/services';
const matrixPrefix = 'service.';

export default function Services({ timeConfig, namespaceId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Services"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      namespaceId={namespaceId}
      paginationResettingProps={['namespaceId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, namespaceId }) {
  return getKubernetesServices({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      'endpoints.internal': {
        metric: 'endpoints.internal',
        aggregation: 'SUM'
      },
      'endpoints.external': {
        metric: 'endpoints.external',
        aggregation: 'SUM'
      },
      pods: {
        metric: 'pods',
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
    id: 'name',
    label: 'Name',
    getContent(item) {
      return <EntityLink icon="lib_kubernetes_service" label={item.name} href$={getServiceDashboard(item.id)} />;
    }
  },
  {
    id: 'type',
    label: 'Type',
    getContent() {
      return 'type';
    }
  },
  {
    id: 'location',
    label: 'Service location',
    getContent() {
      return '127.0.0.1';
    }
  },
  {
    id: 'endpointsInt',
    label: 'Int. endpoints',
    getContent(item) {
      return get(item, ['metrics', 'endpoints.internal']);
    }
  },
  {
    id: 'endpointsExt',
    label: 'Ext. endpoints',
    getContent(item) {
      return get(item, ['metrics', 'endpoints.external']);
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent() {
      return <EntityCounter icon="lib_kubernetes_pod" count={42} />;
    }
  },
  {
    id: 'age',
    label: 'Age',
    getContent() {
      return '42 hours';
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    defaultOrderDirection: 'DESC',
    getContent() {
      return 42;
    }
  }
];
