import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function GoogleCloudRunServiceRevisionDashboard(/* { snapshot } */) {
  // const snapshotId = snapshot.get('id');

  return (
    <>
      <DashboardNotification type="info">
        <h3>Google Cloud Run Monitoring Alpha</h3>
        Instana&apos;s support for Google Cloud Run is currently in an early alpha stage.
      </DashboardNotification>

      {/*
      TODO list the docker containers that are running in this service revision
      <DashboardContainerList snapshotId={snapshotId} />
      */}
    </>
  );
}
