/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import LinuxKVMHypervisorNoDataNotification from 'in-linuxkvmhypervisor/lists/components/LinuxKVMHypervisorNoDataNotification';
import { getLinuxKVMHypervisorHostsWithDefaults } from 'in-linuxkvmhypervisor/subscriptions/getLinuxKVMHypervisorHosts';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useLinuxKVMHypervisorEntityLink } from 'in-linuxkvmhypervisor/navigation/paths';
import { kiloBytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { hostList } from 'in-linuxkvmhypervisor/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { pageNames } from 'in-services/tracking/pageNames';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = hostList;

const linuxkvmhypervisorHostLink = ({ hostname, id }) => {
  const getLinuxKVMHypervisorHostDashboard = useLinuxKVMHypervisorEntityLink('host');

  return <EntityLink label={hostname} href={getLinuxKVMHypervisorHostDashboard(id)} icon="lib_linux" />;
};

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-linuxkvmhypervisor:hostname'),
    getContent: linuxkvmhypervisorHostLink
  },
  {
    id: 'virtualMachines',
    label: t('in-linuxkvmhypervisor:dashboards.numberOfVms'),
    getContent(item) {
      return item.numberOfVms;
    }
  },
  {
    id: 'cpuUsage',
    label: t('in-linuxkvmhypervisor:dashboards.cpuUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.detailed}
          metric="cpuUsage"
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-linuxkvmhypervisor:dashboards.memoryUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={kiloBytesTwoDecimalPlaces}
          metric="memoryUsage"
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function HostList({ timeConfig }) {
    return (
      <>
        <Title title={t('in-linuxkvmhypervisor:linuxkvmhypervisor')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.linuxkvmhypervisor,
            pageRootName: pageNames.linuxkvmhypervisor
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <LinuxKVMHypervisorNoDataNotification icon="lib_linux" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </>
    );
  }
);
function getTableData(params) {
  return getLinuxKVMHypervisorHostsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getLinuxKVMHypervisorHostsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
