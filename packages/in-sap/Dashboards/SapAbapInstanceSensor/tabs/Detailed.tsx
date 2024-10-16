/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import UserConfigurationChanges from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserConfigurationChanges';
import WorkProcessListMetric from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/WorkProcessListMetric';
import DBConnectionProvider from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DBConnectionProvider';
import SystemConfiguration from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SystemConfiguration';
import FileSystemMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FileSystemMetrics';
import DiskSummaryStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DiskSummaryStats';
import BufferStatistics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/BufferStatistics';
import DatabaseHitList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DatabaseHitList';
import TopProcessList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TopProcessList';
import SystemLogStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SystemLogStats';
import LockEntryList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/LockEntryList';
import JobDetails from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/JobDetailsMetric';
import RequestQueue from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RequestQueue';
import UpdateError from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UpdateError';
import TotalMemory from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TotalMemory';
import DumpStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DumpStats';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function Detailed({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.abap_instance_system_overview
        }}
      />
      <WorkProcessListMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <TopProcessList snapshotId={snapshotId} timeConfig={timeConfig} props={data} />
      <RequestQueue snapshotId={snapshotId} timeConfig={timeConfig} />
      <JobDetails snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalMemory snapshotId={snapshotId} timeConfig={timeConfig} />
      <BufferStatistics snapshotId={snapshotId} timeConfig={timeConfig} />
      <DBConnectionProvider snapshotId={snapshotId} timeConfig={timeConfig} />
      <DatabaseHitList snapshotId={snapshotId} timeConfig={timeConfig} />
      <DiskSummaryStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <FileSystemMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <UpdateError snapshotId={snapshotId} timeConfig={timeConfig} />
      <SystemLogStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <SystemConfiguration snapshotId={snapshotId} timeConfig={timeConfig} />
      <UserConfigurationChanges snapshotId={snapshotId} timeConfig={timeConfig} />
      <DumpStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <LockEntryList snapshotId={snapshotId} />
    </>
  );
}
