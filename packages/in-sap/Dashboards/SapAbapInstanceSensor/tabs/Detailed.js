/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import WorkProcessListMetric from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/WorkProcessListMetric';
import DBConnectionProvider from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DBConnectionProvider';
import FileSystemMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FileSystemMetrics';
import DiskSummaryStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DiskSummaryStats';
import BufferStatistics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/BufferStatistics';
import DatabaseHitList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DatabaseHitList';
import TopProcessList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TopProcessList';
import LockEntryList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/LockEntryList';
import JobDetails from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/JobDetailsMetric';
import RequestQueue from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RequestQueue';
import TotalMemory from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TotalMemory';
import DumpStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DumpStats';

export default function Detailed({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <WorkProcessListMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <TopProcessList snapshotId={snapshotId} timeConfig={timeConfig} />
      <BufferStatistics snapshotId={snapshotId} timeConfig={timeConfig} />
      <RequestQueue snapshotId={snapshotId} timeConfig={timeConfig} />
      <JobDetails snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalMemory snapshotId={snapshotId} timeConfig={timeConfig} />
      <DiskSummaryStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <DBConnectionProvider snapshotId={snapshotId} timeConfig={timeConfig} />
      <DatabaseHitList snapshotId={snapshotId} timeConfig={timeConfig} />
      <FileSystemMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <DumpStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <LockEntryList snapshotId={snapshotId} />
    </Fragment>
  );
}
