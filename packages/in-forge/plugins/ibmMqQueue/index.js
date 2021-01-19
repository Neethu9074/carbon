/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/ibmMqQueue/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmMqQueue/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqQueue,
  pluginName: {
    singular: 'IBM MQ Queue',
    plural: 'IBM MQ Queues'
  },
  kpiDefinitions,
  metricDefinitions
});
