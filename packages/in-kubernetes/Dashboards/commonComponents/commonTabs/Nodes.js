import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import ViewWidthRestrictedColumn from 'in-components/Table/components/ViewWidthRestrictedColumn';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import getKubernetesNodes from 'in-subscription/kubernetes/getKubernetesNodes';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { canSortByMetricColumns } from 'in-services/featureFlags';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';

const pathSegment = '/nodes';
const matrixPrefix = 'node.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_node"
          label={item.name}
          href$={getNodeDashboard(item.node.id)}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return item.node.status;
    }
  },
  {
    id: 'roles',
    label: 'Roles',
    getContent(item) {
      return (
        <ViewWidthRestrictedColumn width={15}>{item.node.roles || valueMissingPlaceholder}</ViewWidthRestrictedColumn>
      );
    }
  },
  {
    id: 'age',
    label: 'Age',
    getContent(item) {
      return item.node.age && formatDuration(item.node.age);
    }
  },
  {
    id: 'required_cpu_percentage',
    label: 'CPU Requests',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'limit_cpu_percentage',
    label: 'CPU Limits',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'required_mem_percentage',
    label: 'Memory Requests',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'limit_mem_percentage',
    label: 'Memory Limits',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
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
          snapshotId={item.node.id}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter],
    columnDefinitions,
    defaultOrderBy: 'name',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'nodes'
});

export default function Nodes(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} clusterId={props.clusterId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'type',
  orderDirection = 'ASC',
  timeConfig,
  clusterId
}) {
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
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}
