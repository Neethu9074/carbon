/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/glassfishApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/glassfishApplicationContainer/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.glassfishApplicationContainer,
  pluginName: {
    singular: 'Glassfish',
    plural: 'Glassfish'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Glassfish'
  }
});
