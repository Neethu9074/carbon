/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function KafkaConnectWorkerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.kafkaConnectWorker.connectorCount')}>
          <MetricValue snapshotId={snapshotId} metric="connectorCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kafkaConnectWorker.taskStartupFailure')}>
          <MetricValue snapshotId={snapshotId} metric="taskStartupFailurePercentage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.kafkaConnectWorker.completedRebalances')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['completedRebalancesTotal'],
              labels: [t('in-forge:plugins.kafkaConnectWorker.completedRebalances')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaConnectWorker.rebalancing')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['rebalancing'],
              labels: [t('in-forge:plugins.kafkaConnectWorker.rebalancing')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.kafkaConnectWorker.rebalanceTime')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: millis,
              metrics: ['timeSinceLastRebalanceMs'],
              labels: [t('in-forge:plugins.kafkaConnectWorker.timeSinceLastRebalance')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaConnectWorker.rebalanceAverageTime')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: millis,
              metrics: ['rebalanceAvgTimeMs'],
              labels: [t('in-forge:plugins.kafkaConnectWorker.rebalanceAverageTime')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
