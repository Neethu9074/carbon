import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/awsS3/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsS3,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'AWS S3 Bucket',
    plural: 'AWS S3 Buckets'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 's3_bucket_name'], '');
  }
});
