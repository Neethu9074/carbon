import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudRunServiceRevisionInstance,
  pluginName: {
    singular: 'Google Cloud Run Service Revision Instance',
    plural: 'Google Cloud Run Service Revision Instances'
  },
  supportsInfrastructureTabSubscript: true
});
