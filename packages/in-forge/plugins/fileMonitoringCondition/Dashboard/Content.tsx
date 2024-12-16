/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

//@ts-expect-error
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Conditions from 'in-forge/plugins/fileMonitoringCondition/Dashboard/Conditions';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface FileMonitoringConditionDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}
const FileMonitoringConditionDashboard: React.FC<FileMonitoringConditionDashboardProps> = ({
  snapshot,
  timeConfig
}) => {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');
  return (
    <div>
      <DashboardNotification type="info">
        {t('in-forge:plugins.fileMonitoringCondition.conditionNotification')}
      </DashboardNotification>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.fileMonitoringCondition.issueTriggered')}>
          {data.get('issueTriggered') === 1 ? 'Yes' : 'No'}
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.fileMonitoringCondition.issueTriggered')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['issueTriggered'],
              labels: [t('in-forge:plugins.fileMonitoringCondition.issueTriggered')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Conditions snapshotId={snapshotId} />
    </div>
  );
};

export default FileMonitoringConditionDashboard;
