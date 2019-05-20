import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsEbs,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'AWS EBS Volume',
    plural: 'AWS EBS Volumes'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'volume_id'], '');
  }
});
