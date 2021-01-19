/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/openLDAP/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/openLDAP/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.openLDAP,
  pluginName: {
    singular: 'OpenLDAP Node',
    plural: 'OpenLDAP Nodes'
  },
  kpiDefinitions,
  metricDefinitions
});
