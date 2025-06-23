/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import PropTypes from 'prop-types';
import React from 'react';

// @ts-expect-error needs migration
import { hostIdUrlParameter } from 'in-windowshypervisor/navigation/urlParameters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import getWindowsHypervisorVms from 'in-windowshypervisor/subscriptions/getWindowsHypervisorVMs';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { useWindowsHypervisorEntityLink } from 'in-windowshypervisor/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const pathSegment = '/vms';
const matrixPrefix = 'vm.';

export const VmLabel = ({ item }) => {
  const hostId = item.hostId;
  const getWindowsHypervisorVmDashboard = useWindowsHypervisorEntityLink('vm', { hostId });
  return <EntityLink label={item.name} href={getWindowsHypervisorVmDashboard(item.vmId)} />;
};

VmLabel.propTypes = {
  item: PropTypes.shape({
    hostId: PropTypes.string.isRequired,
    name: PropTypes.string,
    vmId: PropTypes.string.isRequired
  }).isRequired
};

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-windowshypervisor:dashboards.vmName'),
    getContent(item) {
      return <VmLabel item={item} />;
    }
  },
  {
    id: 'noOfCpus',
    label: t('in-windowshypervisor:dashboards.noOfCpus'),
    getContent(item) {
      return item.noOfCpus;
    }
  },
  {
    id: 'vmCpuUsage',
    label: t('in-windowshypervisor:cpuUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.detailed}
          metric="vmCpuUsage"
        />
      );
    }
  },
  {
    id: 'vmMemoryUsage',
    label: t('in-windowshypervisor:memoryUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.detailed}
          metric="vmMemoryUsage"
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    plugin: plugins.windowsHypervisorVM,
    title: t('in-windowshypervisor:dashboards.noDataAvailable.windowsHypervisorVMTitle'),
    description: t('in-windowshypervisor:dashboards.noDataAvailable.windowsHypervisorVMDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, hostIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function windowsHypervisorVirtualMachines(props) {
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
}) {
  return getWindowsHypervisorVms({
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
      hostId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
