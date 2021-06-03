/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudContainerRegistry/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudContainerRegistry/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudContainerRegistry,

  technologyDescriptor: {
    label: 'IBM Cloud Container Registry'
  },
  kpiDefinitions,
  metricDefinitions
});
