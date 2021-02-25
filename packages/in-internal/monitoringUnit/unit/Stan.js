/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';

export default function StanStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.unit.stan.processorInstance')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [`processor.instances`],
            labels: [t('in-internal:monitoringUnit.unit.stan.processorInstance')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.unit.stan.metricDropRateMax')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`processor.metricDropRate.max`],
            labels: [t('in-internal:monitoringUnit.unit.stan.metricDropRateMax')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.unit.stan.metricDropRateMean')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`processor.metricDropRate.mean`],
            labels: [t('in-internal:monitoringUnit.unit.stan.metricDropRateMean')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.unit.stan.appEntityCallDropRate')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`appdata-legacy-converter.callsTotalDropRate`],
            labels: [t('in-internal:monitoringUnit.unit.stan.appEntityCallDropRate')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
