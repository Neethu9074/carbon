/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Monitors from 'in-forge/plugins/fileMonitoring/Dashboard/Monitors';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

interface FileMonitoringDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}
const FileMonitoringDashboard: React.FC<FileMonitoringDashboardProps> = ({ snapshot, timeConfig }) => {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <Monitors snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
};

export default FileMonitoringDashboard;
