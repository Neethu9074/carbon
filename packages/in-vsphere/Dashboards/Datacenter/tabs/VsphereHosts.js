import { get, find } from 'lodash';
import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import getVsphereHosts from 'in-vsphere/subscriptions/getVsphereHosts';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { datacenterIdUrlParameter } from 'in-vsphere/navigation/urlParameters';
import { resourceQuotaPercentage } from 'in-vsphere/formatters';
import { canSortByMetricColumns } from 'in-services/featureFlags';

const pathSegment = '/vsphere-hosts';
const matrixPrefix = 'vhost.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return <SeverityAwareEntityLink icon="lib_linux_host" label={get(item, ['vsphereHost', 'label'])} />;
    }
  },
  {
    id: 'vms',
    label: 'Virtual Machines',
    getContent(item) {
      return <EntityCounter icon="lib_vsphere_vm" count={item.vms} />;
    }
  },
  {
    id: 'required_cpu_percentage',
    label: 'CPU Usage',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['vsphereHost', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'limit_cpu_percentage',
    label: 'CPU Total',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['vsphereHost', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'required_mem_percentage',
    label: 'Memory Usage',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['vsphereHost', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'limit_mem_percentage',
    label: 'Memory Total',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['vsphereHost', 'id'])}
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
  return (
    <ServerTableWithUrlState
      get={getTableData}
      filterColumnDefinitionsByResult={result => {
        return columnDefinition => {
          if (
            result.data &&
            result.data.items &&
            find(result.data.items, item => get(item, ['namespace', 'distributionType'], 'Kubernetes') === 'OpenShift')
          )
            return true;
          else return columnDefinition.id !== 'deploymentConfigs';
        };
      }}
      timeConfig={props.timeConfig}
      datacenterId={props.datacenterId}
    />
  );
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
  return getVsphereHosts({
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
