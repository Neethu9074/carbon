import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from 'in-forge/plugins/pCFApplication/iconPath';

registerSnapshotDefinition({
  plugin: plugins.pCFApplication,
  iconSvgPath,
  pluginName: {
    singular: 'PCF Application',
    plural: 'PCF Applications'
  }
});
