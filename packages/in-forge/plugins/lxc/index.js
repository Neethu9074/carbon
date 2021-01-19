/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/lxc/metricDefinitions';
import tableDefinition from 'in-forge/plugins/lxc/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/lxc/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.lxc,
  pluginName: {
    singular: 'LXC Container',
    plural: 'LXC Containers'
  },
  kpiDefinitions,
  metricDefinitions,
  tableDefinition
});
