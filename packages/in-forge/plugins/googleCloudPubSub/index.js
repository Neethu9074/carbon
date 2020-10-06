import metricDefinitions from 'in-forge/plugins/googleCloudPubSub/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudPubSub/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/googleCloudPubSub/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudPubSub,
  pluginName: {
    singular: 'Google Cloud PubSub',
    plural: 'Google Cloud PubSub'
  },
  technologyDescriptor: {
    label: 'Google Cloud PubSub'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
