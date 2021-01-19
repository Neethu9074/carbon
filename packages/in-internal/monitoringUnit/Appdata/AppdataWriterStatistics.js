/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Host',
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
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
        return `metrics.gauges.clickHouse.clustered.error_rate`;
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
  rows: getDropwizardWithContext('entity.jvm.app.name:"appdata-writer"')
})(function AppdataWriterStatistics({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
  const appdataWritersLabels = getLabels(rows, /^.*(writer-\d+).*$/i);

  return (
    <div>
      <h1>appdata-writer ({rows.length})</h1>

      <DashboardSection title={`Host CPU load`}>
        <Chart
          snapshotIds={rows.map(r => r.host.get('id'))}
          timeConfig={timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: rows.map(() => 'load.1min'),
            labels: appdataWritersLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`ClickHouse Calls`}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.perSecond.compact,
            metrics: rows.map(() => `metrics.meters.clickHouse.clustered.calls`),
            labels: appdataWritersLabels,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="ClickHouse Query Latency (50th)">
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.fixedCompact,
            metrics: rows.map(() => `metrics.timers.clickHouse.clustered.timer.50th`),
            labels: appdataWritersLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="ClickHouse Query Latency (99th)">
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.fixedCompact,
            metrics: rows.map(() => `metrics.timers.clickHouse.clustered.timer.99th`),
            labels: appdataWritersLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`ClickHouse Error Rate`}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: rows.map(() => `metrics.gauges.clickHouse.clustered.error_rate`),
            labels: appdataWritersLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Calls Processing Pipeline Error Rate`}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: rows.map(() => `metrics.gauges.KPI.incoming.calls.error_rate`),
            labels: appdataWritersLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Calls Dropped Due To "Too Old"`}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: rows.map(
              () => `metrics.meters.com.instana.backend.common.kafka.GenericReactorKafkaConsumer.calls.too-old`
            ),
            labels: appdataWritersLabels,
            type: 'stackedArea'
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
      <DashboardSection title="Host Load">
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
      </DashboardSection>

      <DashboardSection title="ClickHouse Query Queueing">
        <Chart
          snapshotId={row.dropwizard.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['metrics.meters.clickHouse.clustered.queueAttempts.calls'],
            labels: ['Newly queued ClickHouse Calls'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.compact,
            metrics: ['metrics.gauges.clickHouse.clustered.queuedCalls'],
            labels: ['Queued ClickHouse Calls'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="ClickHouse Query Latency">
        <Chart
          snapshotId={row.dropwizard.get('id')}
          timeConfig={row.timeConfig}
          margins={{
            left: 90,
            right: 90
          }}
          y1={{
            formatter: number.perSecond.compact,
            metrics: ['metrics.timers.clickHouse.clustered.timer.rate'],
            labels: ['Calls'],
            type: 'stackedArea'
          }}
          y2={{
            formatter: millis.fixedCompact,
            metrics: [
              'metrics.timers.clickHouse.clustered.timer.mean',
              'metrics.timers.clickHouse.clustered.timer.50th',
              'metrics.timers.clickHouse.clustered.timer.99th'
            ],
            labels: ['mean', '50th', '99th'],
            type: 'line'
          }}
        />
      </DashboardSection>

      {row.jvm.getIn(['data', 'jvm.collectors']) ? (
        <DashboardSection title="Garbage Collection">
          <Chart
            snapshotId={row.jvm.get('id')}
            timeConfig={row.timeConfig}
            y1={{
              metrics: row.jvm
                .getIn(['data', 'jvm.collectors'])
                .map(name => 'gc.' + name + '.time')
                .toArray(),
              labels: row.jvm
                .getIn(['data', 'jvm.collectors'])
                .map(name => name + ' Time')
                .toArray(),
              type: 'line',
              formatter: millis.fixedCompact
            }}
            y2={{
              metrics: row.jvm
                .getIn(['data', 'jvm.collectors'])
                .map(name => 'gc.' + name + '.inv')
                .toArray(),
              labels: row.jvm
                .getIn(['data', 'jvm.collectors'])
                .map(name => name + ' Invocations')
                .toArray(),
              type: 'point',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      ) : null}
    </Fragment>
  );
}

function getLabels(rows, regexp) {
  return rows.map(r =>
    r.host
      .get('label')
      .replace(regexp, '$1')
      .replace('.instana.io', '')
  );
}
