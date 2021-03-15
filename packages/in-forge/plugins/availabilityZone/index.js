/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/availabilityZone/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/availabilityZone/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.availabilityZone,
  kpiDefinitions,
  metricDefinitions
});
