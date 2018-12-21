import React from 'react';
import Instance from './Instance.es6';
import RegionsTable from './RegionsTable.es6';

export default function AzureCosmosDbDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <Instance snapshot={snapshot} timeConfig={timeConfig} />
      <RegionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
