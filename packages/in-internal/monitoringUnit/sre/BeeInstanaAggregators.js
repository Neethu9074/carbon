/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import {
  hostTableCols,
  volumeTableCols,
  getPersistentStorageMountRows,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';
import { getBeeInstanaAggregatorWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { seconds, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    aggregators: getBeeInstanaAggregatorWithContext('"beeinstana aggregator"')
  },
  function Overview({ aggregators, timeConfig }) {
    if (aggregators.length === 0) {
      return <LoadingIndicator />;
    }

    aggregators = sort(aggregators);
    const aggregatorLabels = aggregators.map(r => r.host.get('label').replace('.instana.io', ''));

    return (
      <div>
        <h1>
          {t('in-internal:monitoringUnit.sre.beeInstanaAggregator.beeInstanaAggreg', {
            aggregatorLen: aggregators.length
          })}
        </h1>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.metrics')}>
            <Chart
              snapshotIds={aggregators.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: aggregators.map(() => `Aggregator.AggregatorStats.NumMetricsWithData.max`),
                type: 'line',
                formatter: number.detailed,
                labels: aggregatorLabels
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.metricPruningDurations10S')}>
            <Chart
              snapshotIds={aggregators.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: aggregators.map(() => `Aggregator.AggregatorPrune.period10.Duration.max`),
                type: 'line',
                formatter: seconds.detailed,
                labels: aggregatorLabels
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.metricPrunDurations60S')}>
            <Chart
              snapshotIds={aggregators.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: aggregators.map(() => `Aggregator.AggregatorPrune.period60.Duration.max`),
                type: 'line',
                formatter: seconds.detailed,
                labels: aggregatorLabels
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.metricPrunDurations5M')}>
            <Chart
              snapshotIds={aggregators.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: aggregators.map(() => `Aggregator.AggregatorPrune.period300.Duration.max`),
                type: 'line',
                formatter: seconds.detailed,
                labels: aggregatorLabels
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.metricPrunDurations1H')}>
            <Chart
              snapshotIds={aggregators.map(r => r.beeinstana.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: aggregators.map(() => `Aggregator.AggregatorPrune.period3600.Duration.max`),
                type: 'line',
                formatter: seconds.detailed,
                labels: aggregatorLabels
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection
            title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.hostsAggregatorLen', {
              aggregatorLen: aggregators.length
            })}
          >
            <Table cols={hostTableCols} rows={aggregators} getRowDetails={getRowDetails} />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.dataMounts')}>
            <Table
              cols={volumeTableCols}
              rows={getPersistentStorageMountRows(aggregators, timeConfig)}
              getRowDetails={getFsDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.sre.beeInstanaAggregator.cpuUsage')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
            labels: [
              t('in-internal:monitoringUnit.sre.user'),
              t('in-internal:monitoringUnit.sre.system'),
              t('in-internal:monitoringUnit.sre.wait'),
              t('in-internal:monitoringUnit.sre.nice'),
              t('in-internal:monitoringUnit.sre.steal')
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
