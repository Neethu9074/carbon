/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Conditions from 'in-forge/plugins/fileMonitoringCondition/Dashboard/Conditions';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

interface FileMonitoringConditionDashboardProps {
  snapshot: SnapshotData;
}
const FileMonitoringConditionDashboard: React.FC<FileMonitoringConditionDashboardProps> = ({ snapshot }) => {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <Conditions snapshotId={snapshotId} />
    </div>
  );
};

export default FileMonitoringConditionDashboard;
