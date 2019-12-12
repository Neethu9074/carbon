import metricDefinitions from 'in-forge/plugins/awsS3/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsS3/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/awsS3/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsS3,
  pluginName: {
    singular: 'AWS S3 Bucket',
    plural: 'AWS S3 Buckets'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 's3_bucket_name'], '');
  }
});
