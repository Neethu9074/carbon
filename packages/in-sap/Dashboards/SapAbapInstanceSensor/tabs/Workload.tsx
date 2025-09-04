/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import WorkProcessListMetric from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/WorkProcessListMetric';
import TopProcessList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TopProcessList';
import JobDetails from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/JobDetailsMetric';
import RequestQueue from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RequestQueue';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function Workload({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  const snapshot = useObservable(getSnapshot(snapshotId, timeConfig), [snapshotId, timeConfig]);
  if (!snapshot) {
    return null;
  }
  let duration: string = snapshot.get('data').get('duration');

  return (
    <>
      <WorkProcessListMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <TopProcessList snapshotId={snapshotId} timeConfig={timeConfig} props={data} />
      <JobDetails snapshotId={snapshotId} timeConfig={timeConfig} duration={duration} />
      <RequestQueue snapshotId={snapshotId} timeConfig={timeConfig} />
    </>
  );
}
