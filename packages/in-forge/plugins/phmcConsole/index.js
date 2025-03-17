/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/phmcConsole/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
registerSnapshotDefinition({
  plugin: plugins.phmcConsole,

  metricDefinitions,
  getIconType: () => 'phmc_console'
});
