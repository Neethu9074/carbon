/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { get } from 'lodash';
import React from 'react';

import { OrderDirection, TimeConfig } from '@instana/types';

// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getLinuxKVMHypervisorVMs from 'in-linux-kvm-hypervisor/subscriptions/getLinuxKVMHypervisorVMs';
import { useLinuxKVMHypervisorEntityLink } from 'in-linux-kvm-hypervisor/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/vms';
const matrixPrefix = 'vm.';

export const VmLabel = (item: VMRowData) => {
  const hostId = item.hostId;
  const getLinuxKVMHypervisorVmDashboard: any = useLinuxKVMHypervisorEntityLink('vm', { hostId });
  return <EntityLink label={item.name} href={getLinuxKVMHypervisorVmDashboard(item.id)} icon={resolveIcon(item)} />;
};
export interface VMRowData {
  name: string;
  hostId: string;
  id: string;
  state: string;
  vmId: string;
}

function resolveIcon(props: { name: string }) {
  const guestFullName = get(props, ['name'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-linux-kvm-hypervisor:dashboards.vmName'),
    sortable: true,
    getContent(item: VMRowData) {
      return <VmLabel {...item} />;
    }
  },
  {
    id: 'state',
    label: t('in-linux-kvm-hypervisor:dashboards.vmState'),
    sortable: false,
    getContent(item: VMRowData) {
      return item.state;
    }
  },
  {
    id: 'cpuUsage',
    label: t('in-linux-kvm-hypervisor:dashboards.cpuUsage'),
    sortable: false,
    getContent(item: { id: any }, { timeConfig }: any) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="cpuUsageRatio"
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-linux-kvm-hypervisor:dashboards.memoryUsage'),
    sortable: false,
    getContent(item: { id: any }, { timeConfig }: any) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="memoryUsageRatio"
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.linuxKVMHypervisorVM,
    title: t('in-linux-kvm-hypervisor:noMonitoringDataFound'),
    description: t('in-linux-kvm-hypervisor:noMonitoringDataFound')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function LinuxKVMHypervisorVirtualMachines(props: { timeConfig: any; hostId: any }) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} hostId={props.hostId} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig,
  hostId
}: {
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: OrderDirection;
  timeConfig: TimeConfig;
  hostId: string;
}) {
  return getLinuxKVMHypervisorVMs({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      name: query,
      hostId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
