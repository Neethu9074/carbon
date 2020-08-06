import kpiDefinitions from 'in-forge/plugins/iBMMQQueue/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/iBMMQQueue/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMMQQueue,
  pluginName: {
    singular: 'IBM MQ Queue',
    plural: 'IBM MQ Queues'
  },
  iconSvgPath,
  kpiDefinitions
});
