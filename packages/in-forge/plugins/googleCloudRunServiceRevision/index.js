import metricDefinitions from 'in-forge/plugins/googleCloudRunServiceRevision/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudRunServiceRevision/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudRunServiceRevision,
  pluginName: {
    singular: 'Google Cloud Run Service Revision',
    plural: 'Google Cloud Run Service Revisions'
  },
  metricDefinitions,
  kpiDefinitions
});
