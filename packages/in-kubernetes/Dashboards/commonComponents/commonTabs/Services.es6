import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesServices from 'in-subscription/kubernetes/getKubernetesServices';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/services';
const matrixPrefix = 'service.';

export default function Services({ timeConfig, namespaceId, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Services"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      namespaceId={namespaceId}
      clusterId={clusterId}
      paginationResettingProps={['namespaceId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, namespaceId, clusterId }) {
  return getKubernetesServices({
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
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { namespaceId, clusterId }) {
      return (
        <EntityLink
          icon="lib_kubernetes_service"
          label={item.name}
          href$={getServiceDashboard(item.id, { namespaceId, clusterId })}
        />
      );
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
      return item.location;
    }
  },
  {
    id: 'internalEndpoints',
    label: 'Int. endpoints',
    getContent(item) {
      return item.internalEndpoints;
    }
  },
  {
    id: 'externalEndpoints',
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
      return formatDuration(item.age);
    }
  }
];
