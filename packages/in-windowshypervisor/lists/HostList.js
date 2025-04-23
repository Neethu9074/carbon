/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TableEntityCounter } from '@instana/components';

import WindowsHypervisorNoDataNotification from 'in-windowshypervisor/lists/components/WindowsHypervisorNoDataNotification';
import { getWindowsHypervisorHostsWithDefaults } from 'in-windowshypervisor/subscriptions/getWindowsHypervisorHosts';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useWindowsHypervisorEntityLink } from 'in-windowshypervisor/navigation/paths';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { productAreas } from 'in-services/tracking/productAreas';
import { hostList } from 'in-windowshypervisor/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { percentage } from 'in-services/formatters/number';
import { pageNames } from 'in-services/tracking/pageNames';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = hostList;

const WindowsHypervisorHostLink = ({ name, id }) => {
  const getWindowsHypervisorHostDashboard = useWindowsHypervisorEntityLink('host');

  return <EntityLink label={name} href={getWindowsHypervisorHostDashboard(id)} icon="lib_windows" />;
};

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-windowshypervisor:hostName'),
    getContent: WindowsHypervisorHostLink
  },
  {
    id: 'virtualMachines',
    label: t('in-windowshypervisor:noOfVms'),
    getContent: item => <TableEntityCounter count={item.vms} />
  },
  {
    id: 'cpuUsage',
    label: t('in-windowshypervisor:cpuUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.detailed}
          metric="cpuUsage"
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-windowshypervisor:memoryUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.detailed}
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
        <Title title={t('in-windowshypervisor:windowshypervisor')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.windowshypervisor,
            pageRootName: pageNames.windowshypervisor
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <WindowsHypervisorNoDataNotification icon="lib_windows" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </>
    );
  }
);
function getTableData(params) {
  return getWindowsHypervisorHostsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getWindowsHypervisorHostsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
