/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudMongoDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudMongoDb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudMongoDb,

  technologyDescriptor: {
    label: 'IBM Cloud Databases for MongoDB'
  },
  kpiDefinitions,
  metricDefinitions
});
