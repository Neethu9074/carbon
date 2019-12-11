import iconSvgPath from 'in-forge/plugins/pCFSpace/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/pCFSpace';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFSpace,
  iconSvgPath,
  kpiDefinitions,
  pluginName: {
    singular: 'Cloud Foundry Space',
    plural: 'Cloud Foundry Spaces'
  }
});
