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
    getContent(item) {
      return item.type;
    }
  },
  {
    id: 'location',
    label: 'Service location',
    getContent(item) {
      return item.serviceLocation;
    }
  },
  {
    id: 'endpointsInt',
    label: 'Int. endpoints',
    getContent(item) {
      return item.internalEndpoints;
    }
  },
  {
    id: 'endpointsExt',
    label: 'Ext. endpoints',
    getContent(item) {
      return item.externalEndpoints;
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_pod" count={item.pods} />;
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
