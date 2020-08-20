import metricDefinitions from 'in-forge/plugins/ibmMqChannel/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmMqChannel/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/ibmMqChannel/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqChannel,
  pluginName: {
    singular: 'IBM MQ Channel',
    plural: 'IBM MQ Channels'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
