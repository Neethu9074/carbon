/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/jenkins/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/jenkins/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.jenkins,
  pluginName: {
    singular: 'Jenkins',
    plural: 'Jenkins'
  },
  kpiDefinitions,
  metricDefinitions
});
