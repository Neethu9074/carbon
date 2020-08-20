import metricDefinitions from 'in-forge/plugins/ibmMqQueueManager/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmMqQueueManager/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/ibmMqQueueManager/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqQueueManager,
  pluginName: {
    singular: 'IBM MQ Queue Manager',
    plural: 'IBM MQ Queue Managers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
