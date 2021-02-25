/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, seconds } from 'in-services/formatters/number';

export default function AwsSqsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title={t('in-forge:plugins.awsSqs.dashboard.messages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'num_of_msg_delayed',
              'num_of_msg_not_visible',
              'num_of_msg_visible',
              'num_of_empty_receives',
              'num_of_msg_received',
              'num_of_msg_sent'
            ],
            labels: [
              t('in-forge:plugins.awsSqs.dashboard.delayed'),
              t('in-forge:plugins.awsSqs.dashboard.notVisible'),
              t('in-forge:plugins.awsSqs.dashboard.visible'),
              t('in-forge:plugins.awsSqs.dashboard.emptyReceives'),
              t('in-forge:plugins.awsSqs.dashboard.received'),
              t('in-forge:plugins.awsSqs.dashboard.sent')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsSqs.dashboard.oldMessagesAverage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['age_of_oldest_msg'],
            labels: [t('in-forge:plugins.awsSqs.dashboard.ageOfOldestMessage')],
            formatter: seconds.fixedCompact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsSqs.dashboard.sentMessagesSize')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sent_message_size'],
            labels: [t('in-forge:plugins.awsSqs.dashboard.sentMessageSize')],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
