import React, { Fragment } from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import DashboardVersionsList from './DashboardVersionsList';

export default function AwsEcsTaskDefinitionDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <DashboardNotification type="info">
        <h3>Under Construction</h3>
        Instana&apos;s Fargate support is currently in alpha. More data and metrics for AWS ECS Task Definitions are
        coming soon.
      </DashboardNotification>
      <DashboardVersionsList snapshotId={snapshotId} />
    </Fragment>
  );
}
