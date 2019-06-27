import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesConditions from 'in-subscription/kubernetes/getKubernetesConditions';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';

const pathSegment = '/conditions';
const matrixPrefix = 'condition.';

export default function Conditions(props) {
  return (
    <ServerTableWithUrlBoundState
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      paginationResettingProps={['podId', 'nodeId', 'deploymentId', 'deploymentConfigId', 'timeConfig']}
      defaultOrderBy="type"
      defaultOrderDirection="ASC"
      {...props}
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
  podId,
  nodeId,
  deploymentId,
  deploymentConfigId
}) {
  return getKubernetesConditions({
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
      podId,
      nodeId,
      deploymentId,
      deploymentConfigId,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'type',
    label: 'Name',
    getContent(item) {
      return item.type;
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return item.status;
    }
  },
  {
    id: 'lastTransitionTime',
    label: 'Last Transition Time',
    getContent(item) {
      return item.lastTransitionTime || valueMissingPlaceholder;
    }
  },
  {
    id: 'reason',
    label: 'Reason',
    getContent(item) {
      return item.reason || valueMissingPlaceholder;
    }
  },
  {
    id: 'message',
    label: 'Message',
    getContent(item) {
      return item.message || valueMissingPlaceholder;
    }
  }
];
