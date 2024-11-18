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
import ExpandableCard from 'in-components/ExpandableCard';
import Table from 'in-sdk/components/dashboard/Table';
import { Row, Col } from 'in-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const hostViewCols = [
  {
    title: t('in-internal:monitoringUnit.eum.eumHealthProcessor.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.eum.eumHealthProcessor.hostCpuLoad'),
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
    rows: getDropwizardWithContext('entity.jvm.app.name:"eum-health-processor"')
  },
  function EumHealthProcessor({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator />;
    }

    rows = rows.slice().sort((a, b) => compareIgnoreCase(getLabel(a), getLabel(b)));
    const labels = rows.map(getLabel);

    return (
      <div>
        <h1>eum-health-processor</h1>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.hostCpuLoad')}>
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
            <ExpandableCard title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.websiteMonitoring')}>
              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.assignedConfigs')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    minRollup={5000}
                    y1={{
                      min: 0,
                      formatter: number.detailed,
                      metrics: rows.map(
                        () => `metrics.gauges.com.instana.health.model.RelevantAlertConfigs.assigned-website-configs`
                      ),
                      labels: labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.incomingBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.incoming.processed_website_monitoring_beacons.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.droppedIncomingBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.incoming.processed_website_monitoring_beacons.errors`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.outgoingMatchedBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.outgoing.matched_website_monitoring_beacons.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.failOutgoingMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.outgoing.matched_website_monitoring_beacons.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.incomingMatchedBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.incoming.matched_website_monitoring_beacons.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.droppedIncomingMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.incoming.matched_website_monitoring_beacons.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.processedMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.processing.matched_website_monitoring_beacons.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.failProcessedMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.processing.matched_website_monitoring_beacons.errors`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.configEval')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.processing.evaluated_website_health_buckets.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.configEvalFail')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.processing.evaluated_website_health_buckets.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.outgoingEvent')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.outgoing.website_events.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.failOutgoingEvent')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.outgoing.website_events.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>
            </ExpandableCard>
          </Col>
        </Row>

        <Row key="mobile">
          <Col lg={12}>
            <ExpandableCard title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.mobileAppMonitoring')}>
              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.assignedConfigs')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    minRollup={5000}
                    y1={{
                      min: 0,
                      formatter: number.detailed,
                      metrics: rows.map(
                        () => `metrics.gauges.com.instana.health.model.RelevantAlertConfigs.assigned-mobile-app-configs`
                      ),
                      labels: labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.incomingBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.incoming.processed_mobile_app_monitoring_beacons.calls`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.droppedIncomingBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.incoming.processed_mobile_app_monitoring_beacons.errors`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.outgoingMatchedBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.outgoing.matched_mobile_app_monitoring_beacons.calls`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.failOutgoingMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.outgoing.matched_mobile_app_monitoring_beacons.errors`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.incomingMatchedBeacons')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.incoming.matched_mobile_app_monitoring_beacons.calls`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.droppedIncomingMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.incoming.matched_mobile_app_monitoring_beacons.errors`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.processedMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.processing.matched_mobile_app_monitoring_beacons.calls`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection
                  title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.failProcessedMatchedBeacons')}
                >
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.processing.matched_mobile_app_monitoring_beacons.errors`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.configEval')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.processing.evaluated_mobile_app_health_buckets.calls`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.configEvalFail')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(
                        () => `metrics.meters.KPI.processing.evaluated_mobile_app_health_buckets.errors`
                      ),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>

              <Columize>
                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.outgoingEvent')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.outgoing.mobile_app_events.calls`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>

                <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.failOutgoingEvent')}>
                  <Chart
                    snapshotIds={rows.map(r => r.dropwizard.get('id'))}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      formatter: number.perSecond.detailed,
                      metrics: rows.map(() => `metrics.meters.KPI.outgoing.mobile_app_events.errors`),
                      labels,
                      type: 'stackedArea'
                    }}
                  />
                </DashboardSection>
              </Columize>
            </ExpandableCard>
          </Col>
        </Row>

        <Row key="instances">
          <Col lg={12}>
            <DashboardSection title={`eum-health-processors (${rows.length})`}>
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
      <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.hostLoad')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['load.1min'],
            labels: [t('in-internal:monitoringUnit.eum.eumHealthProcessor.hostCpuLoad')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      {row.jvm.getIn(['data', 'jvm.collectors']) ? (
        <DashboardSection title={t('in-internal:monitoringUnit.eum.eumHealthProcessor.garbageCollection')}>
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
