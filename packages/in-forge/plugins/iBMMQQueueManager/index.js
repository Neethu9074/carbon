import kpiDefinitions from 'in-forge/plugins/iBMMQQueueManager/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/iBMMQQueueManager/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMMQQueueManager,
  pluginName: {
    singular: 'IBM MQ Queue Manager',
    plural: 'IBM MQ Queue Managers'
  },
  iconSvgPath,
  kpiDefinitions
});
