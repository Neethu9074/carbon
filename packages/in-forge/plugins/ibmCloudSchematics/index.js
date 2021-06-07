/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudSchematics/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudSchematics/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudSchematics,

  technologyDescriptor: {
    label: 'IBM Cloud Schematics'
  },
  kpiDefinitions,
  metricDefinitions
});
