/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/pCFSpace/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/pCFSpace/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFSpace,

  kpiDefinitions,
  metricDefinitions
});
