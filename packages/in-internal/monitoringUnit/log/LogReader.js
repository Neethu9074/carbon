/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { millis, number, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const hostViewCols = [
  {
    title: t('in-internal:monitoringUnit.log.reader.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.log.reader.hostCpuLoad'),
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
    title: t('in-internal:monitoringUnit.log.reader.clickHouse.queryErrorRate'),
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

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.service.name:"log-reader"')
  },
  function LogReader({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator />;
    }

    rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
    const labels = rows.map(r =>
      r.host
        .get('label')
        .replace('.instana.io', '')
        .replace('ip-', '')
    );

    return (
      <div>
        <h1>{t('in-internal:monitoringUnit.log.reader.title')}</h1>

        <DashboardSection title={t('in-internal:monitoringUnit.log.reader.hostCpuLoad')}>
          <Chart
            snapshotIds={rows.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: rows.map(() => 'load.1min'),
              labels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.gRPCCalls')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: rows.map(() => `metrics.meters.grpc.server.calls`),
                labels: labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.gRPCErrors')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: rows.map(() => `metrics.meters.grpc.server.errors`),
                labels: labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.tagReaderClient.gRPCCalls')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: rows.map(() => `metrics.meters.grpc.client.tagReaderClient.calls`),
                labels: labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.tagReaderClient.gRPCErrors')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: rows.map(() => `metrics.meters.grpc.client.tagReaderClient.errors`),
                labels: labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.select')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(
                  () => `metrics.meters.com.instana.clickhouse.client.ClickHouseHttpClient.select.calls`
                ),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.failSelect')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(
                  () => `metrics.meters.com.instana.clickhouse.client.ClickHouseHttpClient.select.errors`
                ),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.queryLatency50')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: rows.map(() => `metrics.timers.clickHouse.clustered.timer.50th`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.queryLatency99')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: millis.fixedCompact,
                metrics: rows.map(() => `metrics.timers.clickHouse.clustered.timer.99th`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.queryCalls')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.clickHouse.clustered.calls`),
                labels: labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.queryErrorRate')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: percentage.detailed,
                metrics: rows.map(() => `metrics.gauges.clickHouse.clustered.error_rate`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.queuedCalls')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.gauges.clickHouse.clustered.queuedCalls`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.newlyQueuedCalls')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.clickHouse.clustered.queueAttempts.calls`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <DashboardSection
          title={t('in-internal:monitoringUnit.log.reader.instances', {
            length: rows.length
          })}
        >
          <Table cols={hostViewCols} rows={rows} getRowDetails={getRowDetails} />
        </DashboardSection>
      </div>
    );
  }
);

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.log.reader.hostLoad')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['load.1min'],
            labels: [t('in-internal:monitoringUnit.log.reader.hostCpuLoad')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.queryQueueing')}>
        <Chart
          snapshotId={row.dropwizard.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['metrics.meters.clickHouse.clustered.queueAttempts.calls'],
            labels: [t('in-internal:monitoringUnit.log.reader.clickHouse.newlyQueuedCalls')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: number.compact,
            metrics: ['metrics.gauges.clickHouse.clustered.queuedCalls'],
            labels: [t('in-internal:monitoringUnit.log.reader.clickHouse.queuedCalls')],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.log.reader.clickHouse.queryLatency')}>
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
            labels: [t('in-internal:monitoringUnit.log.reader.clickHouse.calls')],
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
              t('in-internal:monitoringUnit.log.reader.clickHouse.mean'),
              t('in-internal:monitoringUnit.log.reader.clickHouse.50th'),
              t('in-internal:monitoringUnit.log.reader.clickHouse.99th')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>

      {row.jvm.getIn(['data', 'jvm.collectors']) ? (
        <DashboardSection title={t('in-internal:monitoringUnit.log.reader.garbageCollection')}>
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
