/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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

function ADHADashboardSection({ title, metric, type, formatter, timeConfig, rows, labels }) {
  return (
    <DashboardSection title={title}>
      <Chart
        snapshotIds={rows.map(r => r.dropwizard.get('id'))}
        timeConfig={timeConfig}
        minRollup={5000}
        y1={{
          min: 0,
          formatter: formatter,
          metrics: rows.map(() => metric),
          labels: labels,
          type: type
        }}
      />
    </DashboardSection>
  );
}

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:"appdata-health-aggregator*"')
})(function AppDataHealthAggregator({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
  const labels = getLabels(rows, /^.*(health-aggregator-\d+).*$/i);

  return (
    <Row>
      <Col xs={12}>
        <div>
          <h1>appdata-health-aggregator</h1>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.hostCpuLoad')}
              type="line"
              metric="load.1min"
              formatter={number.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.activeReg')}
              type="stackedArea"
              metric="metrics.gauges.com.instana.appdata.liveaggregator.aggregation.request.AggregationRequestRegistry.aggregation-requests.owned-entry-count"
              formatter={number.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.stateStoreSyncTime', {
                aggregation: 'mean'
              })}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.sync.mean"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.stateStoreSyncTime', {
                aggregation: '99th'
              })}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.sync.99th"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.stateStoreGroupedSyncTime', {
                aggregation: 'mean'
              })}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.sync-grouped.mean"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.stateStoreGroupedSyncTime', {
                aggregation: '99th'
              })}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.sync-grouped.99th"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.localStateCleanupTime')}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.cleanup-local.mean"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.distributedStateCleanupTime')}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.cleanup-distributed.mean"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.groupedLocalStateCleanupTime')}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.cleanup-grouped-local.mean"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.distributedGroupedStateCleanupTime')}
              type="line"
              metric="metrics.timers.com.instana.appdata.health.aggregator.aggregation.state.HazelcastAggregationStateStore.cleanup-grouped-distributed.mean"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.incomingCalls')}
              type="stackedArea"
              metric="metrics.meters.KPI.incoming.calls.calls"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.droppedIncomingCalls')}
              type="stackedArea"
              metric="metrics.meters.KPI.incoming.calls.errors"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.deserializingCalls')}
              type="stackedArea"
              metric="metrics.meters.KPI.deserializing.calls.calls"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.deserializingCallsErrors')}
              type="stackedArea"
              metric="metrics.meters.KPI.deserializing.calls.errors"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.gRPCCalls')}
              type="stackedArea"
              metric="metrics.meters.grpc.server.calls"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.gRPCErrors')}
              type="stackedArea"
              metric="metrics.meters.grpc.server.errors"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.appMetricsRetrieverReq')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetApplicationMetricsRetriever.requested-metrics"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.getAppMetricsRetriever')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetApplicationMetricsRetriever.answered-metric-requests"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.appMetricsRetrieverNotEnoughData')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetApplicationMetricsRetriever.not-enough-data"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.appMetricsRetrieverNotRegistered')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetApplicationMetricsRetriever.not-registered"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.appMetricsRetrieverStateMissing')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetApplicationMetricsRetriever.state-missing"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.serviceMetricsRetrieverReq')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetServicesWithGranularityMetricRetriever.requested-metrics"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.getServiceMetricsRetriever')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetServicesWithGranularityMetricRetriever.answered-metric-requests"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.serviceMetricsRetrieverNotEnoughData')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetServicesWithGranularityMetricRetriever.not-enough-data"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.serviceMetricsRetrieverNotRegistered')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetServicesWithGranularityMetricRetriever.not-registered"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.serviceMetricsRetrieverStateMissing')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetServicesWithGranularityMetricRetriever.state-missing"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.endpointMetricsRetrieverReq')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetEndpointsWithGranularityMetricRetriever.requested-metrics"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.getEndpointMetricsRetriever')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetEndpointsWithGranularityMetricRetriever.answered-metric-requests"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.endpointMetricsRetrieverNotEnoughData')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetEndpointsWithGranularityMetricRetriever.not-enough-data"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.endpointMetricsRetrieverNotRegistered')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetEndpointsWithGranularityMetricRetriever.not-registered"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.endpointMetricsRetrieverStateMissing')}
              type="stackedArea"
              metric="metrics.meters.com.instana.appdata.health.aggregator.aggregation.retriever.GetEndpointsWithGranularityMetricRetriever.state-missing"
              formatter={number.perSecond.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>

          <Columize>
            <ADHADashboardSection
              title={t('in-internal:monitoringUnit.appdata.appDataAggregator.hazelcastInstanceShutdownTime')}
              type="line"
              metric="metrics.timers.com.instana.appdata.liveaggregator.cache.hazelcast.HazelcastManager.hazelcast-instance-shutdown"
              formatter={millis.detailed}
              timeConfig={timeConfig}
              rows={rows}
              labels={labels}
            />
          </Columize>
          <DashboardSection title={`appdata-health-aggregators (${rows.length})`}>
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
