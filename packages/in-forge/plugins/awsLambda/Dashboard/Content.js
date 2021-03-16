/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AwsLambdaDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleInvocations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['invocations'],
            labels: [t('in-forge:plugins.awsLambda.titleInvocations')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleDurations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['duration', 'duration_maximum', 'duration_minimum'],
            labels: [
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['duration_sum'],
            labels: [t('in-forge:plugins.labelSum')],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleErrors')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['errors'],
            labels: [t('in-forge:plugins.awsLambda.titleErrors')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleThrottles')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['throttles'],
            labels: [t('in-forge:plugins.awsLambda.titleThrottles')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleDeadLetterErrors')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['dead_letter_error'],
            labels: [t('in-forge:plugins.awsLambda.titleDeadLetterErrors')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleIteratorAge')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['iterator_age', 'iterator_age_maximum', 'iterator_age_minimum'],
            labels: [
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['iterator_age_sum'],
            labels: [t('in-forge:plugins.labelSum')],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleConcurrentExecutions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['concurrent_executions', 'concurrent_executions_maximum', 'concurrent_executions_minimum'],
            labels: [
              t('in-forge:plugins.labelAverage'),
              t('in-forge:plugins.labelMaximum'),
              t('in-forge:plugins.labelMinimum')
            ],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['concurrent_executions_sum'],
            labels: [t('in-forge:plugins.labelSum')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsLambda.titleUnreservedConcurrentExecutions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['unreserved_concurrent_executions'],
            labels: [t('in-forge:plugins.awsLambda.titleUnreservedConcurrentExecutions')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
