/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, number } from 'in-services/formatters/number';

export default function StanStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={`Processor Instances`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [`processor.instances`],
            labels: ['Processor Instances'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Metric Drop Rate (max)`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`processor.metricDropRate.max`],
            labels: ['Metric Drop Rate (max)'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Metric Drop Rate (mean)`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`processor.metricDropRate.mean`],
            labels: ['Metric Drop Rate (mean)'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={`Application Entity (Call) Drop Rate`}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: percentage.detailed,
            metrics: [`appdata-legacy-converter.callsTotalDropRate`],
            labels: ['Application Entity (Call) Drop Rate'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
