import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import JobsTable from 'in-forge/plugins/jenkins/Dashboard/JobsTable';

export default function JenkinsDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');

  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return <JobsTable snapshot={snapshot} timeConfig={timeConfig} />;
}
