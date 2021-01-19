/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/natsStreaming/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.natsStreaming,
  pluginName: {
    singular: 'NATS Streaming',
    plural: 'NATS Streaming'
  },
  kpiDefinitions,
  technologyDescriptor: {
    label: 'NATS Streaming'
  }
});
