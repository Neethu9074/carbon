/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.jvm.app.name:"eum-acceptor"')
  },
  function EumAcceptor({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator />;
    }

    rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));

    const labels = rows.map(getLabel);

    return (
      <div>
        <h1>eum-acceptor</h1>

        <h2>{t('in-internal:monitoringUnit.eum.eumAcceptor.load')}</h2>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.hostCpuLoad')}>
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
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.garbageCollectionActivity')}>
            <Chart
              snapshotIds={rows.map(r => r.jvm.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: millis.compact,
                metrics: rows.map(() => 'gc.G1 Young Generation.time'),
                labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.requests')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(
                  () => `metrics.timers.io.dropwizard.jetty.MutableServletContextHandler.requests.rate`
                ),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.dropDueLoadBackpressure')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.dropped`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.dropDueRateLimit')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.droppedDueToRateLimit`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.deliberDropBeaconsDueInvalidData')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.translationErrors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <h2>{t('in-internal:monitoringUnit.eum.eumAcceptor.beaconTypeBreakdown')}</h2>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.pageLoad')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              height={100}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.beaconsByType.pl`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.pageResource')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              height={100}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.beaconsByType.res`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.xhrFetch')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              height={100}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.beaconsByType.xhr`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.error')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              height={100}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.beaconsByType.err`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.customEvent')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              height={100}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.beaconsByType.cus`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.pageChange')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              height={100}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.instana.beaconProcessing.beaconsByType.pc`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <h2>Kafka</h2>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.websiteBeaconWrites')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.kafka.writes.by_topic.website_monitoring_beacons`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.eum.eumAcceptor.mobileAppBeaconWrites')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.kafka.writes.by_topic.mobile_app_monitoring_beacons`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

export function getLabel(row) {
  return row.host
    .get('label')
    .replace('.instana.io', '')
    .replace('ip-', '');
}
