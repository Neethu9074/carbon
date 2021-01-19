/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/activeMQArtemis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/activeMQArtemis/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.activeMQArtemis,
  pluginName: {
    singular: 'ActiveMQ Artemis',
    plural: 'ActiveMQ Artemis'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'ActiveMQArtemis'
  }
});
