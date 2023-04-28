/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { t } from 'in-i18n';

export default function TibcoEMSQueueDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.tibcoEMS.titlePendingMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['pendingMessagesCount'],
            labels: [t('in-forge:plugins.tibcoEMS.labelCount')],
            type: 'line'
          }}
          y2={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['pendingMessagesSize'],
            labels: [t('in-forge:plugins.tibcoEMS.labelSize')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleReceivers')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['receiverCount'],
            labels: [t('in-forge:plugins.tibcoEMS.labelCount')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['inMessagesCount', 'outMessagesCount'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
              t('in-forge:plugins.tibcoEMS.labelOutMessagesCount')
            ],
            type: 'line'
          }}
          y2={{
            formatter: number.detailed,
            metrics: ['inMessages', 'outMessages'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
              t('in-forge:plugins.tibcoEMS.labelOutMessagesRate')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
