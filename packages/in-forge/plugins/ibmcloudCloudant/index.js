/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/ibmcloudCloudant/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmcloudCloudant/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmcloudCloudant,

  technologyDescriptor: {
    label: 'IBM Cloud Cloudant'
  },
  kpiDefinitions,
  metricDefinitions
});
