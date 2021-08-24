/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { SPECS } from 'in-forge/plugins/domino/Dashboard/Content';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/domino/metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.domino,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Domino'
  },
  customMetricsSpecs: SPECS
});
