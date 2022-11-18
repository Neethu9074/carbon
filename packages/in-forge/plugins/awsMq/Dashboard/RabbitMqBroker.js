/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, twoDecimalPlaces } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { greaterThanZeroFormatter } from '../formatters';
import RabbitMqQueuesTable from './RabbitMqQueuesTable';
import MetricValue from 'in-components/MetricValue';
import NodesTable from './NodesTable';
import { t } from 'in-i18n';

export default function RabbitMqBrokerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsMq.dashboard.messagesReady')}>
          <MetricValue snapshotId={snapshotId} metric="message_ready_count" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsMq.dashboard.consumers')}>
          <MetricValue snapshotId={snapshotId} metric="consumer_count" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsMq.dashboard.connections')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="current_connections_count"
            formatter={greaterThanZeroFormatter}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.messagesPerSec')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['publish_rate', 'confirm_rate', 'ack_rate'],
            labels: [
              t('in-forge:plugins.awsMq.dashboard.published'),
              t('in-forge:plugins.awsMq.dashboard.delivered'),
              t('in-forge:plugins.awsMq.dashboard.acknowledged')
            ],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.messageStatus')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['message_ready_count', 'message_unacknowledged_count', 'total_message_count'],
              labels: [
                t('in-forge:plugins.awsMq.dashboard.ready'),
                t('in-forge:plugins.awsMq.dashboard.unacknowledged'),
                t('in-forge:plugins.awsMq.dashboard.total')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['messages_ready_rate', 'messages_unacknowledged_rate', 'messages_rate'],
              labels: [
                t('in-forge:plugins.awsMq.dashboard.readyRate'),
                t('in-forge:plugins.awsMq.dashboard.unacknowledgedRate'),
                t('in-forge:plugins.awsMq.dashboard.totalRate')
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsMq.dashboard.overview')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['consumer_count', 'current_connections_count'],
            labels: [
              t('in-forge:plugins.awsMq.dashboard.consumers'),
              t('in-forge:plugins.awsMq.dashboard.connections')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <NodesTable snapshot={snapshot} timeConfig={timeConfig} />

      <RabbitMqQueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
