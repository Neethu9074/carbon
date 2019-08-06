import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from 'in-forge/plugins/pCFSpace/iconPath';

registerSnapshotDefinition({
  plugin: plugins.pCFSpace,
  iconSvgPath,
  pluginName: {
    singular: 'PCF Space',
    plural: 'PCF Spaces'
  }
});
