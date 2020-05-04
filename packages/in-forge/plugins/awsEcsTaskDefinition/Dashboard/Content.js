import React from 'react';

import DashboardVersionsList from './DashboardVersionsList';

export default function AwsEcsTaskDefinitionDashboard(snapshot) {
  const snapshotId = snapshot.get('id');
  return <DashboardVersionsList snapshotId={snapshotId} />;
}
