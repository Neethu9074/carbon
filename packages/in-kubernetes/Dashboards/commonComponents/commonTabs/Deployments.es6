import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/deployments';
const matrixPrefix = 'deployment.';

export default function Deployments({ timeConfig, namespaceId, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Deployments"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      clusterId={clusterId}
      namespaceId={namespaceId}
      paginationResettingProps={['namespaceId', 'clusterId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, clusterId, namespaceId }) {
  return getKubernetesDeployments({
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
    getContent(item, { clusterId }) {
      return (
        <EntityLink
          icon="lib_kubernetes_workload"
          label={get(item, ['deployment', 'name'])}
          href$={getDeploymentDashboard(get(item, ['deployment', 'id']), { clusterId })}
        />
      );
    }
  },
  {
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return get(item, ['deployment', 'namespace']);
    }
  }
];
