/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/iBMCloudCloudant/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/iBMCloudCloudant/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMCloudCloudant,

  technologyDescriptor: {
    label: 'IBM Cloud Cloudant'
  },
  kpiDefinitions,
  metricDefinitions
});
