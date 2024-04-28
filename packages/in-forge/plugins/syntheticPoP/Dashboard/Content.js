/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function SyntheticPoPDashboard({ snapshot, timeConfig }) {
  const browserStatus = snapshot.getIn(['data', 'browserscript.workloadStatus']);
  const javascriptStatus = snapshot.getIn(['data', 'javascript.workloadStatus']);
  const httpStatus = snapshot.getIn(['data', 'http.workloadStatus']);
  const ismStatus = snapshot.getIn(['data', 'ism.workloadStatus']);

  return (
    <>
      <KpiSection>
        {httpStatus && (
          <KpiKeyValue label={t('in-forge:plugins.syntheticPoP.dashboard.httpKPI')}>
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="http.scheduledTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
            {'/'}
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="http.completedTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
          </KpiKeyValue>
        )}
        {javascriptStatus && (
          <KpiKeyValue label={t('in-forge:plugins.syntheticPoP.dashboard.javascriptKPI')}>
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="javascript.scheduledTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
            {'/'}
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="javascript.completedTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
          </KpiKeyValue>
        )}
        {browserStatus && (
          <KpiKeyValue label={t('in-forge:plugins.syntheticPoP.dashboard.browserKPI')}>
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="browserscript.scheduledTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
            {'/'}
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="browserscript.completedTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
          </KpiKeyValue>
        )}
        {ismStatus && (
          <KpiKeyValue label={t('in-forge:plugins.syntheticPoP.dashboard.ismKPI')}>
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="ism.scheduledTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
            {'/'}
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="ism.completedTasks"
              formatter={number.compact}
              timeWindowAggregation="sum"
            />
          </KpiKeyValue>
        )}
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.syntheticPoP.dashboard.activeTestCount')}>
        <ChartExplanation>{t('in-forge:plugins.syntheticPoP.dashboard.activeTestsDes')}</ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['http.activeTests', 'javascript.activeTests', 'browserscript.activeTests', 'ism.activeTests'],
            labels: [
              t('in-forge:plugins.syntheticPoP.dashboard.http'),
              t('in-forge:plugins.syntheticPoP.dashboard.javascript'),
              t('in-forge:plugins.syntheticPoP.dashboard.browser'),
              t('in-forge:plugins.syntheticPoP.dashboard.ism')
            ],
            type: 'stackedArea',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {httpStatus && (
        <DashboardSection title={t('in-forge:plugins.syntheticPoP.dashboard.httpWorkload')}>
          <ChartExplanation>{t('in-forge:plugins.syntheticPoP.dashboard.httpWorkloadDes')}</ChartExplanation>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['http.scheduledTasks', 'http.completedTasks'],
              labels: [
                t('in-forge:plugins.syntheticPoP.dashboard.scheduled'),
                t('in-forge:plugins.syntheticPoP.dashboard.completed')
              ],
              type: 'line',
              formatter: number.compact,
              aggregation: 'sum'
            }}
            y2={{
              min: 0,
              metrics: ['http.queueDepth'],
              labels: [t('in-forge:plugins.syntheticPoP.dashboard.queueDepth')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      {javascriptStatus && (
        <DashboardSection title={t('in-forge:plugins.syntheticPoP.dashboard.javascriptWorkload')}>
          <ChartExplanation>{t('in-forge:plugins.syntheticPoP.dashboard.javascriptWorkloadDes')}</ChartExplanation>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['javascript.scheduledTasks', 'javascript.completedTasks'],
              labels: [
                t('in-forge:plugins.syntheticPoP.dashboard.scheduled'),
                t('in-forge:plugins.syntheticPoP.dashboard.completed')
              ],
              type: 'line',
              formatter: number.compact,
              aggregation: 'sum'
            }}
            y2={{
              min: 0,
              metrics: ['javascript.queueDepth'],
              labels: [t('in-forge:plugins.syntheticPoP.dashboard.queueDepth')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      {browserStatus && (
        <DashboardSection title={t('in-forge:plugins.syntheticPoP.dashboard.browserWorkload')}>
          <ChartExplanation>{t('in-forge:plugins.syntheticPoP.dashboard.browserWorkloadDes')}</ChartExplanation>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['browserscript.scheduledTasks', 'browserscript.completedTasks'],
              labels: [
                t('in-forge:plugins.syntheticPoP.dashboard.scheduled'),
                t('in-forge:plugins.syntheticPoP.dashboard.completed')
              ],
              type: 'line',
              formatter: number.compact,
              aggregation: 'sum'
            }}
            y2={{
              min: 0,
              metrics: ['browserscript.queueDepth'],
              labels: [t('in-forge:plugins.syntheticPoP.dashboard.queueDepth')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      {ismStatus && (
        <DashboardSection title={t('in-forge:plugins.syntheticPoP.dashboard.ismWorkload')}>
          <ChartExplanation>{t('in-forge:plugins.syntheticPoP.dashboard.ismWorkloadDes')}</ChartExplanation>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['ism.scheduledTasks', 'ism.completedTasks'],
              labels: [
                t('in-forge:plugins.syntheticPoP.dashboard.scheduled'),
                t('in-forge:plugins.syntheticPoP.dashboard.completed')
              ],
              type: 'line',
              formatter: number.compact,
              aggregation: 'sum'
            }}
            y2={{
              min: 0,
              metrics: ['ism.queueDepth'],
              labels: [t('in-forge:plugins.syntheticPoP.dashboard.queueDepth')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      <DashboardSection title={t('in-forge:plugins.syntheticPoP.dashboard.resultQueueDepth')}>
        <ChartExplanation>{t('in-forge:plugins.syntheticPoP.dashboard.resultQueueDes')}</ChartExplanation>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['resultQueueDepth'],
            labels: [t('in-forge:plugins.syntheticPoP.dashboard.queuedResults')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </>
  );
}
