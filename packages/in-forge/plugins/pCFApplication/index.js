import kpiDefinitions from 'in-forge/plugins/pCFApplication/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/pCFApplication/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFApplication,
  pluginName: {
    singular: 'Cloud Foundry Application',
    plural: 'Cloud Foundry Applications'
  },
  iconSvgPath,
  kpiDefinitions
});
