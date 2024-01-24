/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/statsd/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/statsd/kpiDefinitions';
import { SPECS } from 'in-forge/plugins/statsd/Dashboard/Content';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.statsd,

  kpiDefinitions,
  metricDefinitions,
  customMetricsSpecs: SPECS
});
