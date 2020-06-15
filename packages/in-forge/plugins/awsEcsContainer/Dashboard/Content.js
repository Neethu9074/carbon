import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function AwsEcsContainerDashboard() {
  return (
    <>
      <DashboardNotification type="info">
        <h3>Under Construction</h3>
        Instana&apos;s Fargate support is currently in technical preview. More data and metrics for AWS ECS Containers
        are coming soon.
      </DashboardNotification>
    </>
  );
}
