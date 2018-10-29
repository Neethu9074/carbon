import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';

const pathSegment = '/namespaces';
const matrixPrefix = 'namespace.';

export default function Namespaces({ timeConfig }) {
  return (
    <ServerTableWithUrlBoundState
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      cardTitle="Namespaces"
      paginationResettingProps={['clusterId', 'timeConfig']}
      defaultOrderBy="label"
      defaultOrderDirection="DESC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig }) {
  return getKubernetesNamespaces({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      pods: {
        metric: 'pods',
        aggregation: 'SUM'
      },
      services: {
        metric: 'services',
        aggregation: 'SUM'
      }
    },
    filter: {
      label: query,
      // clusterId
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
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_kubernetes_namespace"
          label={item.label}
          href$={getNamespaceDashboard(item.id)}
        />
      );
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_pod" count={item.metrics.pods} />;
    }
  },
  {
    id: 'service',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.metrics.services} />;
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
