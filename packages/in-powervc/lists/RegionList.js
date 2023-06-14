/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getPowerVCRegionsWithDefaults } from 'in-powervc/subscriptions/getPowerVCRegions';
import PowerVCLabel from 'in-powervc/Dashboards/commonComponents/PowerVCLabel';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { percentage, kiloBytes } from 'in-services/formatters/number';
import NoData from 'in-powervc/Dashboards/commonComponents/NoData.js';
import { powervcRegionList } from 'in-powervc/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = powervcRegionList;
const matrixPrefix = 'powervc.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-zhmc:hostname'),
    getContent(item) {
      return <PowerVCLabel item={item} />;
    }
  },
  {
    id: 'powervc',
    label: t('in-powervc:hostIP'),
    getContent(item) {
      return item.powervcId;
    }
  },
  {
    id: 'cpuUsage',
    label: t('in-powervc:cpuUsageAll'),
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
    label: t('in-powervc:memoryUsageAll'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={kiloBytes.detailed}
          metric="memoryUsage"
        />
      );
    }
  },
  {
    id: 'storageUsage',
    label: t('in-powervc:storageUsageAll'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={kiloBytes.detailed}
          metric="storageUsage"
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
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function RegionList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-powervc:powervc')} />
        <ViewTrackingMeta
          data={{
            productArea: 'IBM POWERVC',
            pageRootName: t('in-powervc:powervc')
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <NoData icon="lib_powervc" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getPowerVCRegionsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getPowerVCRegionsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
