/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { datacenterIdUrlParameter } from 'in-vsphere/navigation/urlParameters';
import getVsphereHosts from 'in-vsphere/subscriptions/getVsphereHosts';
import { MemoryTotal } from 'in-vsphere/commonComponents/MemoryTotal';
import { getVsphereHostDashboard } from 'in-vsphere/navigation/paths';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import { plugins } from 'in-forge/constants';

const pathSegment = '/vsphere-hosts';
const matrixPrefix = 'vhost.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-vsphere:dashboards.name'),
    getContent(item) {
      const datacenterId = item.datacenterId;
      return (
        <EntityLink label={item.label} href$={getVsphereHostDashboard(item.id, { datacenterId })} icon="lib_linux" />
      );
    }
  },
  {
    id: 'vms',
    label: t('in-vsphere:dashboards.virtualMachines'),
    getContent(item) {
      return <EntityCounter icon="lib_vsphere_vm" count={item.vms} />;
    }
  },
  {
    id: 'cpu.usage.percent.maximum.*',
    label: t('in-vsphere:dashboards.cpuUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="cpu.usage.percent.maximum.*"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.detailed}
        />
      );
    }
  },
  {
    id: 'cpuTotal',
    label: t('in-vsphere:dashboards.cpuResources'),
    sortable: true,
    getContent(item) {
      return <EntityCounter count={item.cpuTotal} />;
    }
  },
  {
    id: 'mem.usage.average.percent',
    label: t('in-vsphere:dashboards.memoryUsage'),
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.id}
          metric="mem.usage.average.percent"
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentage.detailed}
        />
      );
    }
  },
  {
    id: 'memTotal',
    label: t('in-vsphere:dashboards.memoryResources'),
    sortable: true,
    getContent(item) {
      return <MemoryTotal count={item.memTotal} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.vsphereHost,
    entityName: 'ESXi Hosts'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, datacenterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
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
