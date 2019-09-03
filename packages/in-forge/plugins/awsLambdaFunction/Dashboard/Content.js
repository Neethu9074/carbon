import React from 'react';

import DashboardVersionsList from './DashboardVersionsList';

export default function AwsLambdaFunctionDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return <DashboardVersionsList snapshotId={snapshotId} />;
}
