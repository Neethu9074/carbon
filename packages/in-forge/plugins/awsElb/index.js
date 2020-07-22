import metricDefinitions from 'in-forge/plugins/awsElb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsElb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/awsElb/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsElb,
  pluginName: {
    singular: 'AWS ELB',
    plural: 'AWS ELBs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'load_balancer_name'], '');
  },
  technologyDescriptor: {
    label: 'AWS ELB'
  }
});
