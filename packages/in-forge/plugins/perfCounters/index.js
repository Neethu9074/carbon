/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/perfCounters/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/perfCounters/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.perfCounters,

  kpiDefinitions,
  metricDefinitions
});
