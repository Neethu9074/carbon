/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/iBMCOS/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/iBMCOS/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMCOS,

  technologyDescriptor: {
    label: 'IBM Cloud Object Storage'
  },
  kpiDefinitions,
  metricDefinitions,

});
