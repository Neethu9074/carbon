import kpiDefinitions from 'in-forge/plugins/nats/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/nats/iconPath';
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
