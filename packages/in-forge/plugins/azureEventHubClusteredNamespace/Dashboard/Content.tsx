/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import AzureEventHubNamespaceDashboard from 'in-forge/plugins/azureEventHubNamespace/Dashboard/Content';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function AzureEventHubClusteredNamespaceDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  return <AzureEventHubNamespaceDashboard snapshot={snapshot} timeConfig={timeConfig} />;
}
