import kpiDefinitions from 'in-forge/plugins/iBMMQChannel/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/iBMMQChannel/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMMQChannel,
  pluginName: {
    singular: 'IBM MQ Channel',
    plural: 'IBM MQ Channels'
  },
  iconSvgPath,
  kpiDefinitions
});
