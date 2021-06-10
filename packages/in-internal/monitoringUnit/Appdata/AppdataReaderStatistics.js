/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.hostCpuLoad'),
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
    title: t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.clickHouseErrRate'),
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
  rows: getDropwizardWithContext('entity.jvm.app.name:"appdata-reader"')
})(function AppdataWriterStatistics({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
  const appdataReaderLabels = getLabels(rows, /^.*(reader-\d+).*$/i);

  return (
    <div>
      <h1>appdata-reader ({rows.length})</h1>

      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.hostCpuLoad')}>
        <Chart
          snapshotIds={rows.map(r => r.host.get('id'))}
          timeConfig={timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: rows.map(() => 'load.1min'),
            labels: appdataReaderLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.clickHouseCalls')}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.perSecond.compact,
            metrics: rows.map(() => `metrics.meters.clickHouse.clustered.calls`),
            labels: appdataReaderLabels,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection
        title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.clickHouseQueryLatency50')}
      >
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.fixedCompact,
            metrics: rows.map(() => `metrics.timers.clickHouse.clustered.timer.50th`),
            labels: appdataReaderLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection
        title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.clickHouseQueryLatency99')}
      >
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.fixedCompact,
            metrics: rows.map(() => `metrics.timers.clickHouse.clustered.timer.99th`),
            labels: appdataReaderLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.clickHouseErrorRate')}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: rows.map(() => `metrics.gauges.clickHouse.clustered.error_rate`),
            labels: appdataReaderLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.queuedClickHouseCalls')}>
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: rows.map(() => `metrics.gauges.clickHouse.clustered.queuedCalls`),
            labels: appdataReaderLabels,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection
        title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.newlyQueuedClickHouseCalls')}
      >
        <Chart
          snapshotIds={rows.map(r => r.dropwizard.get('id'))}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: rows.map(() => `metrics.meters.clickHouse.clustered.queueAttempts.calls`),
            labels: appdataReaderLabels,
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
      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.hostLoad')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['load.1min'],
            labels: [t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.hostCpuLoad')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.clickHouseQueryQueueing')}>
        <Chart
          snapshotId={row.dropwizard.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['metrics.meters.clickHouse.clustered.queueAttempts.calls'],
            labels: [t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.newlyQueuedClickHouseCalls')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.compact,
            metrics: ['metrics.gauges.clickHouse.clustered.queuedCalls'],
            labels: [t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.queuedClickHouseCalls')],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.clickHouseQueryLatency')}>
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
            labels: [t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.calls')],
            type: 'stackedArea'
          }}
          y2={{
            formatter: millis.fixedCompact,
            metrics: [
              'metrics.timers.clickHouse.clustered.timer.mean',
              'metrics.timers.clickHouse.clustered.timer.50th',
              'metrics.timers.clickHouse.clustered.timer.99th'
            ],
            labels: [
              t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.mean'),
              t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.50th'),
              t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.99th')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>

      {row.jvm.getIn(['data', 'jvm.collectors']) ? (
        <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataReaderStatistics.garbageCollection')}>
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
      .replace('ip-', '')
  );
}
