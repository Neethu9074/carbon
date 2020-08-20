import metricDefinitions from 'in-forge/plugins/ibmMqQueue/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmMqQueue/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/ibmMqQueue/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqQueue,
  pluginName: {
    singular: 'IBM MQ Queue',
    plural: 'IBM MQ Queues'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
