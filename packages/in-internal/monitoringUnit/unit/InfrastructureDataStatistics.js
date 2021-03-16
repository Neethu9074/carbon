/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function InfrastructureDataStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.unit.infraDataStatistics.numEntities')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [`filler.numberOfEntities`],
            labels: [t('in-internal:monitoringUnit.unit.infraDataStatistics.numEntities')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.unit.infraDataStatistics.entityUsage')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: [`filler.entityUsage`],
            labels: [t('in-internal:monitoringUnit.unit.infraDataStatistics.entityUsage')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.unit.infraDataStatistics.rawMsgDropRateGroupOfEntityMsg')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`filler.rawMessageDropRate`],
            labels: [t('in-internal:monitoringUnit.unit.infraDataStatistics.rawMsgDropRate')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.unit.infraDataStatistics.entityMsgDropRate')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`filler.rawEntityDropRate`],
            labels: [t('in-internal:monitoringUnit.unit.infraDataStatistics.entityMsgDropRate')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
