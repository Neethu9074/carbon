/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudFunctions/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudFunctions/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudFunctions,

  technologyDescriptor: {
    label: 'IBM Cloud Functions'
  },
  kpiDefinitions,
  metricDefinitions
});
