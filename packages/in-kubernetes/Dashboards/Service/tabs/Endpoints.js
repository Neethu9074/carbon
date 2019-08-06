import { get } from 'lodash';
import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesEndpoints from 'in-subscription/kubernetes/getKubernetesEndpoints';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { serviceId } from 'in-kubernetes/navigation/matrix';
import EntityLink from 'in-new-components/EntityLink';
import WithIcon from 'in-new-components/WithIcon';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoints.';

const columnDefinitions = [
  {
    id: 'address',
    label: 'Address',
    getContent(item) {
      return <WithIcon icon="lib_kubernetes_endpoint">{get(item, 'address')}</WithIcon>;
    }
  },
  {
    id: 'port',
    label: 'Port',
    getContent(item) {
      return get(item, 'port');
    }
  },
  {
    id: 'portName',
    label: 'Port Name',
    getContent(item) {
      return get(item, 'portName') || valueMissingPlaceholder;
    }
  },
  {
    id: 'protocol',
    label: 'Protocol',
    getContent(item) {
      return get(item, 'protocol');
    }
  },
  {
    id: 'ready',
    label: 'Status',
    getContent(item) {
      return get(item, 'ready') ? 'Ready' : 'Not Ready';
    }
  },
  {
    id: 'podName',
    label: 'Target',
    getContent(item) {
      return item.podName && item.podSnapshotId ? (
        <EntityLink icon="lib_kubernetes_pod" label={item.podName} href$={getPodDashboard(item.podSnapshotId)} />
      ) : (
        valueMissingPlaceholder
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters, serviceId],
    columnDefinitions,
    defaultOrderBy: 'address',
    defaultOrderDirection: 'ASC',
    defaultPageSize: 10,
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'endpoints'
});

export default function Endpoints(props) {
  const { timeConfig, service } = props;

  return (
    <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} serviceId={service.id} withoutPadding={false} />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'address',
  orderDirection = 'DESC',
  timeConfig,
  serviceId
}) {
  return getKubernetesEndpoints({
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
      serviceId,
      timeConfig
    }
  });
}
