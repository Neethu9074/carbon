/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ElasticPoolTable from './ElasticPoolTable.js';
import DatabaseTable from './DatabaseTable.js';

export default function AzureSqlServerDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DatabaseTable snapshot={snapshot} timeConfig={timeConfig} />
      <ElasticPoolTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
