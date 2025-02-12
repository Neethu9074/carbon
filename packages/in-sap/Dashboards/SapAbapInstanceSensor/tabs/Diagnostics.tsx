/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import UserConfigurationChanges from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserConfigurationChanges';
import SystemConfiguration from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SystemConfiguration';
import SystemLogStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SystemLogStats';
import LockEntryList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/LockEntryList';
import UpdateError from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UpdateError';
import SpoolError from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SpoolError';
import DumpStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DumpStats';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function Diagnostics({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <>
      <UpdateError snapshotId={snapshotId} timeConfig={timeConfig} />
      <SystemLogStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <DumpStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <LockEntryList snapshotId={snapshotId} timeConfig={timeConfig} />
      <SpoolError snapshotId={snapshotId} timeConfig={timeConfig} />
      <SystemConfiguration snapshotId={snapshotId} timeConfig={timeConfig} />
      <UserConfigurationChanges snapshotId={snapshotId} timeConfig={timeConfig} />
    </>
  );
}
