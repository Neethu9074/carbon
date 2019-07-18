import React from 'react';

import createServerTableWithEmptyState from 'in-components/tables/ServerTable/ServerTableWithEmptyState';
import { clusterId, podId, deploymentId, deploymentConfigId } from 'in-kubernetes/navigation/matrix';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import getKubernetesConditions from 'in-subscription/kubernetes/getKubernetesConditions';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';

const pathSegment = '/conditions';
const matrixPrefix = 'condition.';

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

const ServerTableWithUrlState = createServerTableWithEmptyState({
  ServerTable: createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterId, deploymentId, deploymentConfigId, podId],
    columnDefinitions,
    defaultOrderBy: 'type',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'conditions'
});

export default function Conditions(props) {
  return <ServerTableWithUrlState get={getTableData} {...props} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'type',
  orderDirection = 'ASC',
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
