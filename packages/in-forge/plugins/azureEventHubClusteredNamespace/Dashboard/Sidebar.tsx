/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import AzureEventHubNamespaceSidebarDetails from 'in-forge/plugins/azureEventHubNamespace/Dashboard/Sidebar';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function AzureEventHubClusteredNamespaceSidebarDetails({ snapshot }: { snapshot: SnapshotData }) {
  return <AzureEventHubNamespaceSidebarDetails snapshot={snapshot} />;
}
