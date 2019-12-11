import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';
import kpiDefinitions from 'in-forge/plugins/awsEbs/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.awsEbs,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'AWS EBS Volume',
    plural: 'AWS EBS Volumes'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'volume_id'], '');
  }
});
