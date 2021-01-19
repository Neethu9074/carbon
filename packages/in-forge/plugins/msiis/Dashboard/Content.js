/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ApplicationPoolsTable from 'in-forge/plugins/msiis/Dashboard/ApplicationPoolsTable';
import WebsitesTable from 'in-forge/plugins/msiis/Dashboard/WebsitesTable';

export default function MsIISDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <WebsitesTable snapshot={snapshot} timeConfig={timeConfig} />

      <ApplicationPoolsTable snapshot={snapshot} />
    </div>
  );
}
