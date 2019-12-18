import kpiDefinitions from 'in-forge/plugins/pCFSpace/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/pCFSpace/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFSpace,
  pluginName: {
    singular: 'Cloud Foundry Space',
    plural: 'Cloud Foundry Spaces'
  },
  iconSvgPath,
  kpiDefinitions
});
