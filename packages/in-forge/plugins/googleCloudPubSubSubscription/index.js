import metricDefinitions from 'in-forge/plugins/googleCloudPubSubSubscription/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudPubSubSubscription/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudPubSubSubscription,
  pluginName: {
    singular: 'Google Cloud PubSub Subscription',
    plural: 'Google Cloud PubSub Subscriptions'
  },
  kpiDefinitions,
  metricDefinitions
});
