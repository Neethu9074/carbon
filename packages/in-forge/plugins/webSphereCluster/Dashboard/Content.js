/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MemberTable from 'in-forge/plugins/webSphereCluster/Dashboard/MemberTable';

export default function WebSphereClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <MemberTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
