import metricDefinitions from 'in-forge/plugins/googleCloudStorage/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudStorage/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/googleCloudStorage/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudStorage,
  pluginName: {
    singular: 'GCP GCS Bucket',
    plural: 'GCP GCS Buckets'
  },
  technologyDescriptor: {
    label: 'GCP GCS Bucket'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name'], '');
  }
});
