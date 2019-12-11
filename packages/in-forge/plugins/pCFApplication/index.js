import iconSvgPath from 'in-forge/plugins/pCFApplication/iconPath';
import kpiDefinitions from 'in-forge/plugins/pCFApplication';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFApplication,
  iconSvgPath,
  kpiDefinitions,
  pluginName: {
    singular: 'Cloud Foundry Application',
    plural: 'Cloud Foundry Applications'
  }
});
