/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/phmcConsole/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/phmcConsole/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
registerSnapshotDefinition({
  plugin: plugins.phmcConsole,

  kpiDefinitions,
  metricDefinitions,
  getIconType: () => 'phmc_console'
});
