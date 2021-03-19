/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/iBMVSI/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/iBMVSI/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMVSI,

  technologyDescriptor: {
    label: 'IBM Virtual Server Instances'
  },
  kpiDefinitions,
  metricDefinitions
});
