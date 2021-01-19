/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/kafkaConnectWorker/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kafkaConnectWorker/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kafkaConnectWorker,
  pluginName: {
    singular: 'Kafka Worker',
    plural: 'Kafka Workers'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'KafkaWorker'
  }
});
