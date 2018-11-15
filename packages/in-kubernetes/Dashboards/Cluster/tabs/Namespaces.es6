import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/namespaces';
const matrixPrefix = 'namespace.';

export default function Namespaces({ timeConfig, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Namespaces"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      clusterId={clusterId}
      paginationResettingProps={['clusterId', 'timeConfig']}
      defaultOrderBy="label"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, clusterId }) {
  return getKubernetesNamespaces({
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
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <EntityLink
          icon="lib_kubernetes_namespace"
          label={get(item, ['namespace', 'label'])}
          href$={getNamespaceDashboard(get(item, ['namespace', 'id']))}
        />
      );
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
    id: 'service',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
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
