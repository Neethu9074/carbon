import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import LinkToDockerSection from './LinkToDockerSection';

export default function AwsEcsContainerDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <DashboardNotification type="info">
        <h3>Technical Preview</h3>
        Instana&apos;s Fargate support is currently in technical preview.
      </DashboardNotification>
      <LinkToDockerSection snapshotId={snapshotId} />
    </>
  );
}
