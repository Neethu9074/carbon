import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';
import kpiDefinitions from 'in-forge/plugins/awsElb/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.awsElb,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'AWS ELB',
    plural: 'AWS ELBs'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'load_balancer_name'], '');
  }
});
