import metricDefinitions from 'in-forge/plugins/googleCloudPubSubTopic/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudPubSubTopic/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/googleCloudPubSubTopic/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudPubSubTopic,
  pluginName: {
    singular: 'Google Cloud PubSub Topic',
    plural: 'Google Cloud PubSub Topics'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
