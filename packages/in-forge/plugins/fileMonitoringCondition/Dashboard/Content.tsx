/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Conditions from 'in-forge/plugins/fileMonitoringCondition/Dashboard/Conditions';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

interface FileMonitoringConditionDashboardProps {
  snapshot: SnapshotData;
}
const FileMonitoringConditionDashboard: React.FC<FileMonitoringConditionDashboardProps> = ({ snapshot }) => {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.fileMonitoringCondition.issueTriggered')}>
          {data.get('issueTriggered') === 1 ? 'Yes' : 'No'}
        </KpiKeyValue>
      </KpiSection>
      <DashboardNotification type="info">{t('in-forge:plugins.fileMonitoringCondition.nb')}</DashboardNotification>
      <Conditions snapshotId={snapshotId} />
    </div>
  );
};

export default FileMonitoringConditionDashboard;
