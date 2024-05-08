/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AwsSnsDashboard({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsSns.dashboard.messagesPublished')}>
          <MetricValue snapshotId={snapshotId} metric="number_of_messages_published" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsSns.dashboard.messagesFailed')}>
          <MetricValue snapshotId={snapshotId} metric="number_of_notifications_failed" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsSns.dashboard.messagesPublishedSize')}>
          <MetricValue snapshotId={snapshotId} metric="publish_size" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsSns.dashboard.messages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'number_of_messages_published',
                'number_of_notifications_failed',
                'number_of_notifications_delivered'
              ],
              labels: [
                t('in-forge:plugins.awsSns.dashboard.messagesPublished'),
                t('in-forge:plugins.awsSns.dashboard.messagesFailed'),
                t('in-forge:plugins.awsSns.dashboard.publishDelivered')
              ],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsSns.dashboard.publishSize')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['publish_size'],
              labels: [t('in-forge:plugins.awsSns.dashboard.publishSize')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsSns.dashboard.messagesRejected')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['number_of_notifications_filtered_out'],
              labels: [t('in-forge:plugins.awsSns.dashboard.numberOfNotificationsFilteredOut')],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsSns.dashboard.notificationsMovedToDlq')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['number_of_notifications_redriven_to_dlq', 'number_of_notifications_failed_to_redrive_to_dlq'],
              labels: [
                t('in-forge:plugins.awsSns.dashboard.successful'),
                t('in-forge:plugins.awsSns.dashboard.unsuccessful')
              ],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
