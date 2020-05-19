import React, { Fragment } from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import DashboardContainerList from './DashboardContainerList';

export default function AwsEcsTaskDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <Fragment>
      <DashboardNotification type="info">
        <h3>Under Construction</h3>
        Instana&apos;s Fargate support is currently in alpha. More data and metrics for AWS ECS Tasks are coming soon.
      </DashboardNotification>
      <DashboardContainerList snapshotId={snapshotId} />;
    </Fragment>
  );
}
