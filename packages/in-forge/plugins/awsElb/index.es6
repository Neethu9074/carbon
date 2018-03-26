import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsElb,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS ELB',
    plural: 'AWS ELBs'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'load_balancer_name'], '');
  }
});
