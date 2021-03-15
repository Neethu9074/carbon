/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesEndpoints from 'in-subscription/kubernetes/getKubernetesEndpoints';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { serviceIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';
import WithIcon from 'in-new-components/WithIcon';
import { t } from 'in-i18n';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoints.';

const columnDefinitions = [
  {
    id: 'address',
    label: t('in-kubernetes:dashboards.address'),
    getContent(item) {
      return <WithIcon icon="lib_kubernetes_endpoint">{get(item, 'address')}</WithIcon>;
    }
  },
  {
    id: 'port',
    label: t('in-kubernetes:dashboards.port'),
    getContent(item) {
      return get(item, 'port');
    }
  },
  {
    id: 'portName',
    label: t('in-kubernetes:dashboards.portName'),
    getContent(item) {
      return get(item, 'portName') || valueMissingPlaceholder;
    }
  },
  {
    id: 'protocol',
    label: t('in-kubernetes:dashboards.protocol'),
    getContent(item) {
      return get(item, 'protocol');
    }
  },
  {
    id: 'ready',
    label: t('in-kubernetes:dashboards.status'),
    getContent(item) {
      return get(item, 'ready') ? t('in-kubernetes:dashboards.ready') : t('in-kubernetes:dashboards.notReady');
    }
  },
  {
    id: 'podName',
    label: t('in-kubernetes:dashboards.target'),
    getContent(item) {
      return item.podName && item.podSnapshotId ? (
        <EntityLink icon="lib_kubernetes_pod" label={item.podName} href$={getPodDashboard(item.podSnapshotId)} />
      ) : (
        valueMissingPlaceholder
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'endpoints'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, serviceIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'address',
  defaultOrderDirection: 'ASC',
  defaultPageSize: 10,
  pathSegment,
  matrixPrefix
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
