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
    title: t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.hostCpuLoad'),
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
  rows: getDropwizardWithContext('entity.label:"appdata-health-processor*"')
})(function AppDataHealthProcessor({ rows, timeConfig }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
  const labels = getLabels(rows, /^.*(live-aggregator-\d+).*$/i);

  return (
    <Row>
      <Col xs={12}>
        <div>
          <h1>appdata-health-processor</h1>

          <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.hostCpuLoad')}>
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

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.processedIntervals')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.processing.intervals.calls`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.skippedIntervals')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.processing.interval_skips.calls`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failedProcessedInterval')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.processing.intervals.errors`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.ownedConfig')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.detailed,
                  metrics: rows.map(
                    () =>
                      `metrics.gauges.com.instana.appdata.health.state.AlertConfigurationLoader.alert-configurations.owned-entry-count`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.processedConfig')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.processing.configs.calls`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failProcessedConfig')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.processing.configs.errors`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.outgoingEvent')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.outgoing.events.calls`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failOutgoingEvent')}>
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.outgoing.events.errors`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.appdataReaderAppMetricsReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-reader-metricsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdReaderAppMetricsReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-reader-metricsconcurrencyLimit.acquire.errors`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.appdataReaderPerServiceReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-reader-per-service-metricsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdataReaderPerServiceReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-reader-per-service-metricsconcurrencyLimit.acquire.errors`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.appdataReaderPerEndpointReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-reader-per-endpoint-metricsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdataReaderPerEndpointReq')}
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
                      `metrics.meters.grpc.client.appdata-reader-per-endpoint-metricsconcurrencyLimit.acquire.errors`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t(
                'in-internal:monitoringUnit.appdata.appdataHealthProcessor.appdataHealthAggregatorAppMetricsReq'
              )}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-health-aggregator-metricsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t(
                'in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdHealthAggregatorAppMetricsReq'
              )}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-health-aggregator-metricsconcurrencyLimit.acquire.errors`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t(
                'in-internal:monitoringUnit.appdata.appdataHealthProcessor.appdataHealthAggregatorPerServiceReq'
              )}
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
                      `metrics.meters.grpc.client.appdata-health-aggregator-per-service-metricsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t(
                'in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdataHealthAggregatorPerServiceReq'
              )}
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
                      `metrics.meters.grpc.client.appdata-health-aggregator-per-service-metricsconcurrencyLimit.acquire.errors`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t(
                'in-internal:monitoringUnit.appdata.appdataHealthProcessor.appdataHealthAggregatorPerEndpointReq'
              )}
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
                      `metrics.meters.grpc.client.appdata-health-aggregator-per-endpoint-metricsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t(
                'in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdataHealthAggregatorPerEndpointReq'
              )}
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
                      `metrics.meters.grpc.client.appdata-health-aggregator-per-endpoint-metricsconcurrencyLimit.acquire.errors`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.evaluationStorageUpdates')}
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
                      `metrics.meters.com.instana.appdata.health.state.entity.AlertEvaluationEntityStorage.updates.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failEvaluationStorageUpdates')}
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
                      `metrics.meters.com.instana.appdata.health.state.entity.AlertEvaluationEntityStorage.updates.errors`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Columize>

          <DashboardSection
            title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.processesCount', {
              length: rows.length
            })}
          >
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
      <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.hostLoad')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['load.1min'],
            labels: [t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.hostCpuLoadLabel')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      {row.jvm.getIn(['data', 'jvm.collectors']) ? (
        <DashboardSection title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.garbageCollection')}>
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
