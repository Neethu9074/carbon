/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LinkToDockerSection from './LinkToDockerSection';

export default function AwsEcsContainerDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <LinkToDockerSection snapshotId={snapshotId} />
    </>
  );
}
