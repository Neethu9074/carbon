/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Situations from 'in-forge/plugins/fileMonitoring/Dashboard/Situations';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

interface FileMonitoringDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}
const FileMonitoringDashboard: React.FC<FileMonitoringDashboardProps> = ({ snapshot, timeConfig }) => {
  const snapshotId = snapshot.get('id');
  //    const data = snapshot.get('data');
  return (
    <div>
      <Situations snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
};

export default FileMonitoringDashboard;
