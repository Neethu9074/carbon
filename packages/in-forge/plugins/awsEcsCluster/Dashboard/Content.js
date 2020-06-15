import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function AwsEcsClusterDashboard() {
  return (
    <DashboardNotification type="info">
      <h3>Under Construction</h3>
      Instana&apos;s Fargate support is currently in technical preview. More data and metrics for AWS ECS Clusters are
      coming soon.
    </DashboardNotification>
  );
}
