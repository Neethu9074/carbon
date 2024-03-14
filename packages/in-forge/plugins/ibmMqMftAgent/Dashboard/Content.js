/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import DestinationTransferStatesTable from 'in-forge/plugins/ibmMqMftAgent/Dashboard/DestinationTransferStatesTable';
import SourceTransferStatesTable from 'in-forge/plugins/ibmMqMftAgent/Dashboard/SourceTransferStatesTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { formatDateTime } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { getAgentStatus } from './AgentStatus.tsx';
import { t } from 'in-i18n';

export default function IbmMqMftAgentDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftAgent.dashboard.agentStatus')}>
          <MetricValue snapshotId={snapshotId} metric="agentStatusMetric" formatter={getAgentStatus} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftAgent.dashboard.runningTransfers')}>
          <MetricValue snapshotId={snapshotId} metric="runningTransfers" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftAgent.dashboard.totalCurrentTransfers')}>
          <MetricValue snapshotId={snapshotId} metric="totalCurrentTransfers" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftAgent.dashboard.publishedAt')}>
          <MetricValue snapshotId={snapshotId} metric="publishTime" formatter={formatDateTime} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqMftAgent.dashboard.recentActivities')}>
        <div>
          <p>{t('in-forge:plugins.ibmMqMftAgent.dashboard.recentActivitiesDesc')}</p>
        </div>
        <SourceTransferStatesTable snapshot={snapshot} />
        <DestinationTransferStatesTable snapshot={snapshot} />
      </DashboardSection>
    </div>
  );
}
