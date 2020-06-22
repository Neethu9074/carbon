import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import DashboardContainerList from './DashboardContainerList';

export default function AwsEcsTaskDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <DashboardNotification type="info">
        <h3>Technical Preview</h3>
        Instana&apos;s Fargate support is currently in technical preview.
      </DashboardNotification>
      <DashboardContainerList snapshotId={snapshotId} />
    </>
  );
}
