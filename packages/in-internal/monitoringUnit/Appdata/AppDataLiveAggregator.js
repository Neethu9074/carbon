/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import { compareIgnoreCase } from 'in-services/util/string';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { Row, Col } from 'in-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const hostViewCols = [
  {
    title: t('in-internal:monitoringUnit.appdata.appDataAggregator.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appDataAggregator.hostCpuLoad'),
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
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:"appdata-live-aggregator*"')
})(function AppDataLiveAggregator({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
  const labels = getLabels(rows, /^.*(live-aggregator-\d+).*$/i);

  return (
    <Row>
      <Col xs={12}>
        <div>
          <h1>appdata-live-aggregator</h1>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.hostCpuLoad')}>
              <Chart
                snapshotIds={rows.map(r => r.host.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.detailed,
                  metrics: rows.map(() => 'load.1min'),
                  labels: labels,
                  type: 'line'
                }}
              />
            </DashboardSection>

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.activeReg')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.detailed,
                  metrics: rows.map(
                    () =>
                      'metrics.gauges.com.instana.appdata.liveaggregator.aggregation.request.AggregationRequestRegistry.store-size'
                  ),
                  labels: labels,
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.stateStoreSyncTime')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: millis.detailed,
                  metrics: rows.map(
                    () =>
                      'metrics.timers.com.instana.appdata.liveaggregator.aggregation.state.HazelcastAggregationStateStore.sync.mean'
                  ),
                  labels: labels,
                  type: 'line'
                }}
              />
            </DashboardSection>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.stateStoreSyncTime')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: millis.detailed,
                  metrics: rows.map(
                    () =>
                      'metrics.timers.com.instana.appdata.liveaggregator.aggregation.state.HazelcastAggregationStateStore.sync.99th'
                  ),
                  labels: labels,
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.incomingCalls')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.incoming.calls.calls`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.droppedIncomingCalls')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.incoming.calls.errors`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.deserializingCalls')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.deserializing.calls.calls`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.deserializingCallsErrors')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.deserializing.calls.errors`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.gRPCCalls')}>
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

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.gRPCErrors')}>
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
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.appMetricsRetrieverReq')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () =>
                      `metrics.meters.com.instana.appdata.liveaggregator.aggregation.request.GetApplicationMetricsRetriever.requested-metrics`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.getAppMetricsRetriever')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () =>
                      `metrics.meters.com.instana.appdata.liveaggregator.aggregation.request.GetApplicationMetricsRetriever.answered-metric-requests`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.getMetricsRetriever')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () =>
                      `metrics.meters.com.instana.appdata.liveaggregator.aggregation.request.GetMetricsRetriever.requested-metrics`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.getMetricsRetrieverMetricReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () =>
                      `metrics.meters.com.instana.appdata.liveaggregator.aggregation.request.GetMetricsRetriever.answered-metric-requests`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <DashboardSection title={`appdata-live-aggregators (${rows.length})`}>
            <Table cols={hostViewCols} rows={rows} getRowDetails={getRowDetails} />
          </DashboardSection>
        </div>
      </Col>
    </Row>
  );
});

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.hostLoad')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['load.1min'],
            labels: [t('in-internal:monitoringUnit.appdata.appDataAggregator.hostCpuLoad')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      {row.jvm.getIn(['data', 'jvm.collectors']) ? (
        <DashboardSection title={t('in-internal:monitoringUnit.appdata.appDataAggregator.garbageCollection')}>
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
              formatter: millis.fixedDetailed
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
              formatter: number.detailed
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
