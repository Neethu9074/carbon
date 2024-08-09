/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Conditions from 'in-forge/plugins/fileMonitoringCondition/Dashboard/Conditions';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

interface FileMonitoringConditionDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}
const FileMonitoringConditionDashboard: React.FC<FileMonitoringConditionDashboardProps> = ({
  snapshot,
  timeConfig
}) => {
  const snapshotId = snapshot.get('id');
  // const data = snapshot.get('data');
  return (
    <div>
      <Conditions snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
};

export default FileMonitoringConditionDashboard;
