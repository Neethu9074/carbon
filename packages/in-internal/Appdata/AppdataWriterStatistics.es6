import { combineLatest } from 'reactive-observables';
import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage } from 'in-services/formatters/number';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { emptyArray } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import search from 'in-subscription/search';
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
    title: 'KPI.incoming.calls.error_rate',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.gauges.KPI.incoming.calls.error_rate`;
      },
      getContent: percentage.detailed,
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
  rows: timeConfig$
    .flatMap(timeConfig =>
      search({
        query: 'entity.label:"appdata-writer"',
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'dropwizardApplicationContainer'
      })
        .flatMap(getSnapshots, timeConfig)
        .flatMap(dropwizardSnapshots => {
          return combineLatest(dropwizardSnapshots.map(getHostSnapshotId))
            .flatMap(getSnapshots)
            .map(hosts => hosts.filter(h => !!h))
            .map(hosts => {
              return hosts.map(host => {
                const dropwizard = dropwizardSnapshots.find(
                  s => s.getIn(['entityId', 'host']) === host.getIn(['entityId', 'host'])
                );
                return {
                  key: dropwizard.get('id'),
                  host: host,
                  dropwizard,
                  timeConfig
                };
              });
            });
        })
    )
    .startWith(emptyArray)
})(function AppdataWriterStatistics({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));

  return (
    <div>
      <DashboardSection title={`appdata-writer Host CPU load`}>
        <Chart
          snapshotIds={rows.map(r => r.host.get('id'))}
          timeConfig={timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: rows.map(() => 'load.1min'),
            labels: rows.map(r => r.host.get('label')),
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`appdata-writers (${rows.length})`}>
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
