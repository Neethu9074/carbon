import metricDefinitions from 'in-forge/plugins/iBMMQTopic/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/iBMMQTopic/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/iBMMQTopic/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMMQTopic,
  pluginName: {
    singular: 'IBM MQ Topic',
    plural: 'IBM MQ Topics'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
