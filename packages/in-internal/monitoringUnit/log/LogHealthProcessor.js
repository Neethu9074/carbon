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
import { millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { Row, Col } from 'in-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const hostViewCols = [
  {
    title: t('in-internal:monitoringUnit.log.logHealthProcessor.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.log.logHealthProcessor.hostCpuLoad'),
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

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.jvm.app.name:"log-health-processor"')
  },
  function LogHealthProcessor({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator />;
    }

    rows = rows.slice().sort((a, b) => compareIgnoreCase(getLabel(a), getLabel(b)));
    const labels = rows.map(getLabel);

    return (
      <div>
        <h1>log-health-processor</h1>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.hostCpuLoad')}>
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
        </Columize>

        <Row key="website">
          <Col lg={12}>
            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.assignedConfigs')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  minRollup={5000}
                  y1={{
                    min: 0,
                    formatter: number.detailed,
                    metrics: rows.map(
                      () => `metrics.gauges.com.instana.health.model.RelevantAlertConfigs.assigned-log-alert-configs`
                    ),
                    labels: labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.incomingEnrichedLogs')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.incoming.enriched_logs.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection
                title={t('in-internal:monitoringUnit.log.logHealthProcessor.droppedIncomingEnrichedLogs')}
              >
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.incoming.enriched_logs.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.outgoingMatchedLogs')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.outgoing.matched_logs.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.failOutgoingMatchedLogs')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.outgoing.matched_logs.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.incomingMatchedLogs')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.incoming.matched_logs.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection
                title={t('in-internal:monitoringUnit.log.logHealthProcessor.droppedIncomingMatchedLogs')}
              >
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.incoming.matched_logs.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.processedMatchedLogs')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.processing.matched_logs.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.failProcessedMatchedLogs')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.processing.matched_logs.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.configEval')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.processing.evaluated_log_health_buckets.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.configEvalFail')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.processing.evaluated_log_health_buckets.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>

            <Columize>
              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.outgoingEvent')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.outgoing.events.calls`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>

              <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.failOutgoingEvent')}>
                <Chart
                  snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    formatter: number.perSecond.detailed,
                    metrics: rows.map(() => `metrics.meters.KPI.outgoing.events.errors`),
                    labels,
                    type: 'stackedArea'
                  }}
                />
              </DashboardSection>
            </Columize>
          </Col>
        </Row>

        <Row key="instances">
          <Col lg={12}>
            <DashboardSection title={`log-health-processors (${rows.length})`}>
              <Table cols={hostViewCols} rows={rows} getRowDetails={getRowDetails} />
            </DashboardSection>
          </Col>
        </Row>
      </div>
    );
  }
);

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.hostLoad')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['load.1min'],
            labels: [t('in-internal:monitoringUnit.log.logHealthProcessor.hostCpuLoad')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      {row.jvm.getIn(['data', 'jvm.collectors']) ? (
        <DashboardSection title={t('in-internal:monitoringUnit.log.logHealthProcessor.garbageCollection')}>
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

export function getLabel(row) {
  return row.host.get('label').replace('.instana.io', '').replace('ip-', '');
}
