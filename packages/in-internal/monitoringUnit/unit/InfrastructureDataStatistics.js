/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';

export default function InfrastructureDataStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={`Number of Entities`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [`filler.numberOfEntities`],
            labels: ['Number of Entities'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Entity Usage`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: [`filler.entityUsage`],
            labels: ['Entity Usage'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Raw Message Drop Rate (group of entity messages)`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`filler.rawMessageDropRate`],
            labels: ['Raw Message Drop Rate'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Entity Message Drop Rate`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`filler.rawEntityDropRate`],
            labels: ['Entity Message Drop Rate'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
