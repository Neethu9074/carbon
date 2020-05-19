import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function AwsEcsServiceDashboard() {
  return (
    <DashboardNotification type="info">
      <h3>Under Construction</h3>
      Instana&apos;s Fargate support is currently in alpha. More data and metrics for AWS ECS Services are coming soon.
    </DashboardNotification>
  );
}
