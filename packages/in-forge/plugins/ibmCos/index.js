/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCos/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCos/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmCos,

  technologyDescriptor: {
    label: 'IBM Cloud Object Storage'
  },
  kpiDefinitions,
  metricDefinitions
});
