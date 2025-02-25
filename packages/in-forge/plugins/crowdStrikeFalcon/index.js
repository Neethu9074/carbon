/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/crowdStrikeFalcon/metricDefinitions';
import tableDefinition from 'in-forge/plugins/crowdStrikeFalcon/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.crowdStrikeFalcon,

  tableDefinition,
  metricDefinitions
});
