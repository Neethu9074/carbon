import kpiDefinitions from 'in-forge/plugins/iBMMQListener/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/iBMMQListener/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMMQListener,
  pluginName: {
    singular: 'IBM MQ Listener',
    plural: 'IBM MQ Listeners'
  },
  iconSvgPath,
  kpiDefinitions
});
