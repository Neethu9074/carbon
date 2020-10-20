import metricDefinitions from 'in-forge/plugins/googleCloudDatastore/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudDatastore/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/googleCloudDatastore/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudDatastore,
  pluginName: {
    singular: 'Google Cloud Datastore',
    plural: 'Google Cloud Datastores'
  },
  technologyDescriptor: {
    label: 'Google Cloud Datastore'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
