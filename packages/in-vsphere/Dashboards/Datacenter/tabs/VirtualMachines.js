import { get } from 'lodash';
import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import getVsphereVms from 'in-vsphere/subscriptions/getVsphereVms';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import { datacenterIdUrlParameter } from 'in-vsphere/navigation/urlParameters';
import { resourceQuotaPercentage } from 'in-vsphere/formatters';
import { canSortByMetricColumns } from 'in-services/featureFlags';

const pathSegment = '/vms';
const matrixPrefix = 'vm.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return <SeverityAwareEntityLink icon="lib_vsphere_vm" label={get(item, ['vm', 'label'])} />;
    }
  },
  {
    id: 'cpuUsage',
    label: 'CPU Usage',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.cpuUsage}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'cpuAllocation',
    label: 'CPU Resources',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.cpuAllocation}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: 'Memory Usage',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.memoryUsage}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'memoryAllocation',
    label: 'Memory Resources',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.memoryAllocation}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters, datacenterIdUrlParameter],
    columnDefinitions,
    defaultOrderBy: 'label',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'vhosts'
});

export default function VsphereHosts(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} datacenterId={props.datacenterId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  datacenterId
}) {
  return getVsphereVms({
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
      datacenterId,
      timeConfig
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}
