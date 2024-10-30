/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { TableEntityCounter } from '@instana/legacy';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { datacenterIdUrlParameter } from 'in-nutanix/navigation/urlParameters';
import { MemoryTotal } from 'in-nutanix/commonComponents/MemoryTotal';
import { useNutanixEntityLink } from 'in-nutanix/navigation/paths';
import getNutanixVms from 'in-nutanix/subscriptions/getNutanixVms';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import Capitalize from 'in-components/Capitalize';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/vms';
const matrixPrefix = 'vm.';

export const VmLabel = ({ item }) => {
  const hostId = item.hostId;
  const datacenterId = item.datacenterId;

  const getNutanixVmDashboard = useNutanixEntityLink('vm', { hostId, datacenterId });

  return <EntityLink label={item.label} href={getNutanixVmDashboard(item.id)} icon={resolveIcon(item)} />;
};

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-nutanix:name'),
    getContent: item => <VmLabel item={item} />
  },
  {
    id: 'guestState',
    label: t('in-nutanix:dashboards.state'),
    sortable: true,
    getContent(item) {
      return <Capitalize>{get(item, ['guestState'], valueMissingPlaceholder)}</Capitalize>;
    }
  },
  {
    id: 'cpu.usage.maximum.percent',
    label: t('in-nutanix:cpuUsage'),
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
    label: t('in-nutanix:cpuResources'),
    sortable: true,
    getContent(item) {
      return <TableEntityCounter count={item.cpuTotal} />;
    }
  },
  {
    id: 'mem.usage.average.percent',
    label: t('in-nutanix:memoryUsage'),
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
    label: t('in-nutanix:memoryResources'),
    sortable: true,
    getContent(item) {
      return <MemoryTotal count={item.memTotal} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.nutanixVM,
    title: t('in-nutanix:dashboards.noDataAvailable.nutanixVMTitle'),
    description: t('in-nutanix:dashboards.noDataAvailable.nutanixVMDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, datacenterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function nutanixVirtualMachines(props) {
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
  return getNutanixVms({
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
    granularity: getInfraGranularity(timeConfig)
  });
}

function resolveIcon(props) {
  const guestFullName = get(props, ['guestFullName'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}

function isWithinDatacenter(props) {
  const pathname = get(props, ['location', 'pathname'], '/nutanix/datacenter/vms');
  return pathname && pathname.toLowerCase().includes('datacenter');
}
