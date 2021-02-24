/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/kafkaConnectCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kafkaConnectCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kafkaConnectCluster,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'KafkaConnect'
  }
});
