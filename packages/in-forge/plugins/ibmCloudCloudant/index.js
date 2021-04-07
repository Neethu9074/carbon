/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudCloudant/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudCloudant/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudCloudant,

  technologyDescriptor: {
    label: 'IBM Cloud Cloudant'
  },
  kpiDefinitions,
  metricDefinitions
});
