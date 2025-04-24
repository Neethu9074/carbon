/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/azureEventHubNamespace/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureEventHubNamespace/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureEventHubClusteredNamespace,
  kpiDefinitions,
  metricDefinitions
});
