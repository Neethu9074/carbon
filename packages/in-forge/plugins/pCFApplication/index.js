import kpiDefinitions from 'in-forge/plugins/pCFApplication/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFApplication,
  pluginName: {
    singular: 'Cloud Foundry Application',
    plural: 'Cloud Foundry Applications'
  },
  kpiDefinitions
});
