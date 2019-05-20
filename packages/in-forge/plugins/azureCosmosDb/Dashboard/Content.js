import React from 'react';
import Instance from './Instance.js';
import RegionsTable from './RegionsTable.js';

export default function AzureCosmosDbDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <Instance snapshot={snapshot} timeConfig={timeConfig} />
      <RegionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
