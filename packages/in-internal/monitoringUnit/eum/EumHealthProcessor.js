/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import ExpandableCard from 'in-components/ExpandableCard';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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

        <Row key={`website`}>
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
                        () =>
                          `metrics.gauges.com.instana.eum.health.model.RelevantAlertConfigs.assigned-website-configs`
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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

        <Row key={`website`}>
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
                        () =>
                          `metrics.gauges.com.instana.eum.health.model.RelevantAlertConfigs.assigned-mobile-app-configs`
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
                      formatter: number.perSecond.compact,
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
      </div>
    );
  }
);

export function getLabel(row) {
  return row.host.get('label').replace('.instana.io', '').replace('ip-', '');
}
