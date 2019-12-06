import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { datacenterIdUrlParameter } from 'in-vsphere/navigation/urlParameters';
import { getVsphereVmDashboard } from 'in-vsphere/navigation/paths';
import getVsphereVms from 'in-vsphere/subscriptions/getVsphereVms';
import { canSortByMetricColumns } from 'in-services/featureFlags';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import { MemoryTotal } from './MemoryTotal';
import { get } from 'lodash';

const pathSegment = '/vms';
const matrixPrefix = 'vm.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      const hostId = item.hostId;
      const datacenterId = item.datacenterId;
      return (
        <EntityLink
          label={item.label}
          href$={getVsphereVmDashboard(item.id, { hostId, datacenterId })}
          icon={resolveIcon(item)}
        />
      );
    }
  },
  {
    id: 'cpu.usage.maximum.percent',
    label: 'CPU Usage',
    sortable: canSortByMetricColumns,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cpu.usage.maximum.percent"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'cpuTotal',
    label: 'CPU Resources',
    sortable: canSortByMetricColumns,
    getContent(item) {
      return <EntityCounter count={item.cpuTotal} />;
    }
  },
  {
    id: 'mem.usage.average.percent',
    label: 'Memory Usage',
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="mem.usage.average.percent"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.compact}
        />
      );
    }
  },
  {
    id: 'memTotal',
    label: 'Memory Resources',
    sortable: canSortByMetricColumns,
    getContent(item) {
      return <MemoryTotal count={item.memTotal} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'vms'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, datacenterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function VsphereHosts(props) {
  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={props.timeConfig}
      datacenterId={props.datacenterId}
      hostId={props.hostId}
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
  datacenterId,
  hostId
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
      hostId,
      timeConfig
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}

function resolveIcon(props) {
  const guestFullName = get(props, ['guestFullName'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}
