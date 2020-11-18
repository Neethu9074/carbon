import { get } from 'lodash';
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
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import { plugins } from 'in-forge/constants';
import { MemoryTotal } from './MemoryTotal';

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
    sortable: true,
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
    sortable: true,
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
    sortable: true,
    getContent(item) {
      return <MemoryTotal count={item.memTotal} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.vsphereVM,
    entityName: 'vSphere VMs'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, datacenterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function VsphereVirtualMachines(props) {
  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={props.timeConfig}
      datacenterId={isWithinDatacenter(props) ? props.datacenterId : undefined}
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

function isWithinDatacenter(props) {
  const pathname = get(props, ['location', 'pathname'], '/vsphere/datacenter/vms');
  return pathname && pathname.toLowerCase().includes('datacenter');
}
