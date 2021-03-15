/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/ibmcloudObjectStorage/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmcloudObjectStorage/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmcloudObjectStorage,

  technologyDescriptor: {
    label: 'IBM Cloud Object Storage'
  },
  kpiDefinitions,
  metricDefinitions
});
