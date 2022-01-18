/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/crowdStrikeFalcon/metricDefinitions';
import tableDefinition from 'in-forge/plugins/crowdStrikeFalcon/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/crowdStrikeFalcon/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.crowdStrikeFalcon,

  kpiDefinitions,
  tableDefinition,
  metricDefinitions
});
