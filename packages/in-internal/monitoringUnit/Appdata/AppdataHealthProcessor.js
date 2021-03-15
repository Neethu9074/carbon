/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import { compareIgnoreCase } from 'in-services/util/string';
import Columize from 'in-sdk/components/dashboard/Columize';
import { Row, Col } from 'in-new-components/layout/Grid';
import Table from 'in-sdk/components/dashboard/Table';
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
})(function AppdataHealthProcessor({ rows, timeConfig }) {
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
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.appdataLiveAggreApplMetricsReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-live-aggregator-metricsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.noResultAppdataAggreAppMetricsReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(() => `metrics.meters.KPI.processing.fallbacks.calls`),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdataLiveAggreAppMetricsReqs')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-live-aggregator-metricsconcurrencyLimit.acquire.errors`
                  ),
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
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.appReaderCallGroupsReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-reader-groupsconcurrencyLimit.acquire.calls`
                  ),
                  labels: labels,
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>

            <DashboardSection
              title={t('in-internal:monitoringUnit.appdata.appdataHealthProcessor.failAppdataReaderCallGroupsReq')}
            >
              <Chart
                snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                timeConfig={timeConfig}
                minRollup={5000}
                y1={{
                  min: 0,
                  formatter: number.perSecond.detailed,
                  metrics: rows.map(
                    () => `metrics.meters.grpc.client.appdata-reader-groupsconcurrencyLimit.acquire.errors`
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
