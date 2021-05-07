/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudRedis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudRedis/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudRedis,

  technologyDescriptor: {
    label: 'IBM Cloud Databases for Redis'
  },
  kpiDefinitions,
  metricDefinitions
});
