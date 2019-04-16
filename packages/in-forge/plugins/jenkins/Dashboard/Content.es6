import React from 'react';

import { KpiHeading, KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardNotification from 'in-components/DashboardNotification';
import JobsTable from 'in-forge/plugins/jenkins/Dashboard/JobsTable';
import { getLabel } from 'in-sdk/snapshot';

export default function JenkinsDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');

  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const jobs = data.get('jobNames');
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        {jobs && <KpiKeyValue label="Total Jobs">{jobs.size}</KpiKeyValue>}
      </KpiSection>

      {jobs && jobs.size > 0 && <JobsTable snapshot={snapshot} timeConfig={timeConfig} />}
    </div>
  );
}
