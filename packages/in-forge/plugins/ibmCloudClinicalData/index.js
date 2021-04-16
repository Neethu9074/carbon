/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudClinicalData/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudClinicalData/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudClinicalData,

  technologyDescriptor: {
    label: 'IBM Cloud ClinicalData'
  },
  kpiDefinitions,
  metricDefinitions,

});
