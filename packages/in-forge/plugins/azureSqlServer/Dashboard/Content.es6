import React from 'react';
import DatabaseTable from './DatabaseTable.es6';
import ElasticPoolTable from './ElasticPoolTable.es6';

export default function AzureSqlServerDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DatabaseTable snapshot={snapshot} timeConfig={timeConfig} />
      <ElasticPoolTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
