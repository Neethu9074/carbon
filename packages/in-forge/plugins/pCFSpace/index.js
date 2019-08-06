import iconSvgPath from 'in-forge/plugins/pCFSpace/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFSpace,
  iconSvgPath,
  pluginName: {
    singular: 'PCF Space',
    plural: 'PCF Spaces'
  }
});
