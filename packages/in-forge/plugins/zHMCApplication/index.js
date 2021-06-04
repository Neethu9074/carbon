/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/zHMCApplication/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/zHMCApplication/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
registerSnapshotDefinition({
  plugin: plugins.zHMCApplication,

  kpiDefinitions,
  metricDefinitions
});
