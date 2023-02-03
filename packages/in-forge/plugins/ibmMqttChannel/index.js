/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/ibmMqttChannel/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmMqttChannel/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqttChannel,

  kpiDefinitions,
  metricDefinitions
});
