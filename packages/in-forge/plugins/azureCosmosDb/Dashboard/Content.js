import React from 'react';

import RegionsTable from 'in-forge/plugins/azureCosmosDb/Dashboard/RegionsTable';
import Instance from 'in-forge/plugins/azureCosmosDb/Dashboard/Instance';

export default function AzureCosmosDbDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <Instance snapshot={snapshot} timeConfig={timeConfig} />
      <RegionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
