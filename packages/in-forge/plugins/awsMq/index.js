import metricDefinitions from 'in-forge/plugins/awsMq/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsMq/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/awsMq/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsMq,
  pluginName: {
    singular: 'Amazon MQ',
    plural: 'Amazon MQs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'broker_name'], '');
  }
});
