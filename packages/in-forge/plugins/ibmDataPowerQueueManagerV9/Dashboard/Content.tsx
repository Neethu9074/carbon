/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

interface IbmDataPowerQueueManagerV9DashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmDataPowerQueueManagerV9Dashboard = ({ snapshot, timeConfig }: IbmDataPowerQueueManagerV9DashboardProps) => {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerQueueManagerV9.backendActiveConversations')}>
          <MetricValue snapshotId={snapshotId} metric="backendActiveConversations" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerQueueManagerV9.frontendActiveConversations')}>
          <MetricValue snapshotId={snapshotId} metric="frontendActiveConversations" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerQueueManagerV9.activeConversations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['backendActiveConversations', 'frontendActiveConversations'],
            labels: [
              t('in-forge:plugins.ibmDataPowerQueueManagerV9.backendActiveConversations'),
              t('in-forge:plugins.ibmDataPowerQueueManagerV9.frontendActiveConversations')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
};

export default IbmDataPowerQueueManagerV9Dashboard;
