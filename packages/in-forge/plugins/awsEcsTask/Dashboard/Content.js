import React from 'react';

import DashboardContainerList from './DashboardContainerList';

export default function AwsEcsTaskDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return <DashboardContainerList snapshotId={snapshotId} />;
}
