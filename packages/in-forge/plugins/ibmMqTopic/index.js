/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/ibmMqTopic/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmMqTopic/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqTopic,
  pluginName: {
    singular: 'IBM MQ Topic',
    plural: 'IBM MQ Topics'
  },
  kpiDefinitions,
  metricDefinitions
});
