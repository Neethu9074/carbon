/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/vsphereVM/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/vsphereVM/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.vsphereVM,
  pluginName: {
    singular: 'vSphere VM',
    plural: 'vSphere VMs'
  },
  kpiDefinitions,
  metricDefinitions
});
