import React from 'react';

import { namespaceId, clusterId, deploymentId, deploymentConfigId } from 'in-kubernetes/navigation/matrix';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesServices from 'in-subscription/kubernetes/getKubernetesServices';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/services';
const matrixPrefix = 'service.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return <EntityLink icon="lib_kubernetes_service" label={item.name} href$={getServiceDashboard(item.id)} />;
    }
  },
  {
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return item.namespace;
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
  },
  {
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.id}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      namespaceId,
      clusterId,
      deploymentId,
      deploymentConfigId
    ],
    columnDefinitions,
    defaultOrderBy: 'name',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'services'
});

export default function ServiceTable(props) {
  return <ServerTableWithUrlState get={getTableData} {...props} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig,
  namespaceId,
  clusterId,
  deploymentId,
  deploymentConfigId,
  resultTransformer = result => result
}) {
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
      deploymentId,
      deploymentConfigId,
      timeConfig
    }
  }).map(resultTransformer);
}
