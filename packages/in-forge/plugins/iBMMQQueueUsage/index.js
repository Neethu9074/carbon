import kpiDefinitions from 'in-forge/plugins/iBMMQQueueUsage/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/iBMMQQueueUsage/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMMQQueueUsage,
  pluginName: {
    singular: 'IBM MQ Queue Usage',
    plural: 'IBM MQ Queue Usages'
  },
  iconSvgPath,
  kpiDefinitions
});
