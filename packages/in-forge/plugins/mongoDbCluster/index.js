/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/mongoDbCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mongoDbCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mongoDbCluster,

  kpiDefinitions,
  metricDefinitions
});
