import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/dataRetrieval';
import { number, percentage } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Host',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: 'Host CPU load',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `load.1min`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'ClickHouse Error Rate',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.gauges.clickHouse.error_rate`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:"appdata-reader"')
})(function AppdataWriterStatistics({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));

  return (
    <div>
      <DashboardSection title={`appdata-reader Host CPU load`}>
        <Chart
          snapshotIds={rows.map(r => r.host.get('id'))}
          timeConfig={timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: rows.map(() => 'load.1min'),
            labels: rows.map(r => r.host.get('label')),
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`appdata-reader ClickHouse Calls`}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.perSecond.compact,
            metrics: rows.map(() => `metrics.meters.clickHouse.calls`),
            labels: rows.map(r => r.host.get('label')),
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`appdata-reader ClickHouse Error Rate`}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: rows.map(() => `metrics.gauges.clickHouse.error_rate`),
            labels: rows.map(r => r.host.get('label')),
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`appdata-readers (${rows.length})`}>
        <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
      </DashboardSection>
    </div>
  );
});

function getRowDetails(row) {
  return (
    <Fragment>
      <Chart
        snapshotId={row.host.get('id')}
        timeConfig={row.timeConfig}
        minRollup={5000}
        y1={{
          min: 0,
          formatter: number.detailed,
          tooltipFormatter: number.detailed,
          metrics: ['load.1min'],
          labels: ['Host CPU Load'],
          type: 'stackedArea'
        }}
      />

      <Chart
        snapshotId={row.dropwizard.get('id')}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: ['metrics.gauges.clickHouse.runningCalls', 'metrics.meters.clickHouse.queueAttempts.calls'],
          labels: ['Running ClickHouse Calls', 'Newly queued ClickHouse Calls'],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: number.compact,
          metrics: ['metrics.gauges.clickHouse.queuedCalls'],
          labels: ['Queued ClickHouse Calls'],
          type: 'line'
        }}
      />
    </Fragment>
  );
}
