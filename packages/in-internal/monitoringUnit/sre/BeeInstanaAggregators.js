import React, { Fragment } from 'react';

import {
  hostTableCols,
  volumeTableCols,
  getPersistentStorageMountRows,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { getBeeInstanaAggregatorWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { seconds, number } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

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
        <h1>BeeInstana Aggregators ({aggregators.length})</h1>
        <Columize>
          <DashboardSection title={`Metrics`}>
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
          <DashboardSection title={`Metric pruning durations - 10s period`}>
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
          <DashboardSection title={`Metric pruning durations - 60s period`}>
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
          <DashboardSection title={`Metric pruning durations - 5m period`}>
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
          <DashboardSection title={`Metric pruning durations - 1h period`}>
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
          <DashboardSection title={`Hosts (${aggregators.length})`}>
            <Table cols={hostTableCols} rows={aggregators} getRowDetails={getRowDetails} />
          </DashboardSection>
          <DashboardSection title="Data mounts">
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
      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
            labels: ['User', 'System', 'Wait', 'Nice', 'Steal'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
