import kpiDefinitions from 'in-forge/plugins/natsStreaming/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/natsStreaming/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.natsStreaming,
  pluginName: {
    singular: 'NATS Streaming',
    plural: 'NATS Streaming'
  },
  iconSvgPath,
  kpiDefinitions,
  technologyDescriptor: {
    label: 'NATS Streaming'
  }
});
