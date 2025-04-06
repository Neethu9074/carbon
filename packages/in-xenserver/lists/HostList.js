/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TableEntityCounter } from '@instana/components';

import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import XenServerNoDataNotification from 'in-xenserver/lists/components/XenServerNoDataNotification';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getXenServerHostsWithDefaults } from 'in-xenserver/subscriptions/getXenServerHosts';
import { kiloBytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { useXenServerEntityLink } from 'in-xenserver/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { pageNames } from 'in-services/tracking/pageNames';
import { hostList } from 'in-xenserver/navigation/paths';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = hostList;

const XenServerHostLink = ({ name, id }) => {
  const getXenServerHostDashboard = useXenServerEntityLink('host');

  return <EntityLink label={name} href={getXenServerHostDashboard(id)} icon="lib_xenserver" />;
};

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-xenserver:hostName'),
    getContent: XenServerHostLink
  },
  {
    id: 'virtualMachines',
    label: t('in-xenserver:noOfVms'),
    getContent: item => <TableEntityCounter count={item.vms} />
  },
  {
    id: 'cpuAvg',
    label: t('in-xenserver:dashboards.cpuAvg'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.detailed}
          metric="cpu_avg"
        />
      );
    }
  },
  {
    id: 'memoryFree',
    label: t('in-xenserver:dashboards.memoryFree'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={kiloBytesTwoDecimalPlaces}
          metric="memory_free_kib"
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
        <Title title={t('in-xenserver:xenserver')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.xenserver,
            pageRootName: pageNames.xenserver
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <XenServerNoDataNotification icon="lib_xenserver" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </>
    );
  }
);
function getTableData(params) {
  return getXenServerHostsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getXenServerHostsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
