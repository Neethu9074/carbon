import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsMq,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Amazon MQ',
    plural: 'Amazon MQs'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'broker_name'], '');
  }
});
