import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import DashboardTasksList from './DashboardTasksList';

export default function AwsEcsTaskDefinitionVersionDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <>
      <DashboardNotification type="info">
        <h3>Under Construction</h3>
        Instana&apos;s Fargate support is currently in technical preview. More data and metrics for AWS ECS Task
        Definition Versions are coming soon.
      </DashboardNotification>
      <DashboardTasksList snapshotId={snapshotId} />
    </>
  );
}
