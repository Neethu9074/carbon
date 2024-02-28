/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ExecutorsTable from 'in-forge/plugins/azureDatabricks/Dashboard/ExecutorsTable';
import ClustersTable from 'in-forge/plugins/azureDatabricks/Dashboard/ClustersTable';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function AzureDatabricksDashboard({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <ClustersTable snapshot={snapshot} />
      <ExecutorsTable snapshot={snapshot} />
    </div>
  );
}
