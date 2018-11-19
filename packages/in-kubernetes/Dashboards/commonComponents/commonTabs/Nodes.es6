import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesNodes from 'in-subscription/kubernetes/getKubernetesNodes';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/nodes';
const matrixPrefix = 'node.';

export default function Services({ timeConfig, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Nodes"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      clusterId={clusterId}
      paginationResettingProps={['clusterId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, clusterId }) {
  return getKubernetesNodes({
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
    id: 'name',
    label: 'Name',
    getContent(item, { clusterId }) {
      return (
        <EntityLink
          icon="lib_kubernetes_node"
          label={get(item, ['node', 'name'])}
          href$={getNodeDashboard(get(item, ['node', 'id']), { clusterId })}
        />
      );
    }
  },
  {
    id: 'internalIp',
    label: 'Internal IP',
    getContent(item) {
      return get(item, ['node', 'internalIp']);
    }
  }
];
