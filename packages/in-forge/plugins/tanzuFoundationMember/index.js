import kpiDefinitions from 'in-forge/plugins/tanzuFoundationMember/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tanzuFoundationMember,
  pluginName: {
    singular: 'Tanzu Foundation',
    plural: 'Tanzu Foundations'
  },
  kpiDefinitions
});
