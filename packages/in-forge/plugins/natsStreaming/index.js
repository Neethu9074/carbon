import kpiDefinitions from 'in-forge/plugins/natsStreaming/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/natsStreaming/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.nats,
  pluginName: {
    singular: 'NATS',
    plural: 'NATS'
  },
  iconSvgPath,
  kpiDefinitions,
  technologyDescriptor: {
    label: 'NATS'
  }
});
