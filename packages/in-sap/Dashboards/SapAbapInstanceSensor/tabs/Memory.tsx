/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import FileSystemMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FileSystemMetrics';
import DiskSummaryStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DiskSummaryStats';
import BufferStatistics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/BufferStatistics';
import TotalMemory from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TotalMemory';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function Memory({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <>
      <TotalMemory snapshotId={snapshotId} timeConfig={timeConfig} />
      <BufferStatistics snapshotId={snapshotId} timeConfig={timeConfig} />
      <DiskSummaryStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <FileSystemMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
    </>
  );
}
