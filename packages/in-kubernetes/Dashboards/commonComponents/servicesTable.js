import React from 'react';

import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesServices from 'in-subscription/kubernetes/getKubernetesServices';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import EntityLink from 'in-new-components/EntityLink';

export default function servicesTable(TableComponent) {
  return ServiceTable.bind(null, TableComponent);
}

function ServiceTable(TableComponent, props) {
  return (
    <TableComponent
      get={getTableData}
      columnDefinitions={columnDefinitions}
      paginationResettingProps={['namespaceId', 'timeConfig']}
      defaultOrderBy="name"
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
