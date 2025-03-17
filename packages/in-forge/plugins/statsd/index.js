/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/statsd/metricDefinitions';
import { SPECS } from 'in-forge/plugins/statsd/Dashboard/Content';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.statsd,

  metricDefinitions,
  customMetricsSpecs: SPECS
});
