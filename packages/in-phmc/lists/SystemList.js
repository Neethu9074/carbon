/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import PhmcNoDataNotification from 'in-phmc/lists/components/PhmcNoDataNotification';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { systemList, useIbmpSystemDashboard } from 'in-phmc/navigation/paths';
import { getSystemsSubscribeEvent } from 'in-phmc/subscriptions/getSystems';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { percentage, number } from 'in-services/formatters/number';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { pageNames } from 'in-services/tracking/pageNames';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = systemList;
const matrixPrefix = 'system.';

function EntityLinkLabel({ item }) {
  const getIbmpSystemDashboard = useIbmpSystemDashboard();

  return <EntityLink label={item.label} href={getIbmpSystemDashboard(item.id, { consoleId: item.consoleId })} />;
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-phmc:name'),
    getContent(item) {
      return <EntityLinkLabel item={item} />;
    }
  },
  {
    id: 'partitions',
    label: t('in-phmc:partitions'),
    getContent(item) {
      return item.partitions;
    }
  },
  {
    id: 'vios',
    label: t('in-phmc:vios'),
    getContent(item) {
      return item.vios;
    }
  },
  {
    id: 'utilizedProcUnits',
    label: t('in-phmc:utilizedProcNumber'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="utilizedProcUnits"
        />
      );
    }
  },
  {
    id: 'utilizedProcUnitsPercent',
    label: t('in-phmc:utilizedProc'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="utilizedProcUnitsPercent"
        />
      );
    }
  },
  {
    id: 'availableMem',
    label: t('in-phmc:memAvailable'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="availableMem"
        />
      );
    }
  },
  {
    id: 'availableMemPercentage',
    label: t('in-phmc:memAvailablePercentage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="availableMemPercentage"
        />
      );
    }
  },
  {
    id: 'machineTypeModel',
    label: t('in-phmc:machineTypeModel'),
    getContent(item) {
      return item.machineTypeModel;
    }
  },
  {
    id: 'machineSerial',
    label: t('in-phmc:machineSerial'),
    getContent(item) {
      return item.machineSerial;
    }
  }
];
const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});
export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function SystemList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-phmc:ibmpPhmcs')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.ibmpower,
            pageRootName: pageNames.ibmp_phmcs_systems
          }}
        />
        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <PhmcNoDataNotification />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getSystemsSubscribeEvent(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getSystemsSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
