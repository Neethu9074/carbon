import metricDefinitions from 'in-forge/plugins/awsEbs/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsEbs/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/awsEbs/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEbs,
  pluginName: {
    singular: 'AWS EBS Volume',
    plural: 'AWS EBS Volumes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'volume_id'], '');
  }
});
