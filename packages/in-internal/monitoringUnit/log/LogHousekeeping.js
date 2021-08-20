/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.jvm.app.name:"log-writer"')
  },
  function LogHousekeeping({ rows, timeConfig }) {
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
        <h1>{t('in-internal:monitoringUnit.log.housekeeping.title')}</h1>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.cleanup.success')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logCleanUpService.number-old-partitions-dropped-success`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.cleanup.failure')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logCleanUpService.number-old-partitions-dropped-failure`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.cleanup.duration')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: millis.fixedCompact,
                metrics: rows.map(() => `metrics.timers.logCleanUpService.log-clean-up-timer.99th`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.cleanup.skips.mutations')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logCleanUpService.number-skips-because-of-running-mutations`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.success')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logColdTierService.number-runs-success`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.failure')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logColdTierService.number-runs-failure`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.optimize')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logColdTierService.number-runs-optimize`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.move')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logColdTierService.number-runs-move`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.skips.mutations')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logColdTierService.number-skips-because-of-running-mutations`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.skips.merges')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logColdTierService.number-skips-because-of-running-merges`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.skips.moves')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: rows.map(() => `metrics.meters.logColdTierService.number-skips-because-of-running-moves`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.log.housekeeping.coldTier.duration')}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: millis.fixedCompact,
                metrics: rows.map(() => `metrics.timers.logColdTierService.log-cold-tier-timer.99th`),
                labels: labels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);
