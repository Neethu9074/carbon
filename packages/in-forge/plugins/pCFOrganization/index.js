import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from 'in-forge/plugins/pCFOrganization/iconPath';

registerSnapshotDefinition({
  plugin: plugins.pCFOrganization,
  iconSvgPath,
  pluginName: {
    singular: 'PCF Organization',
    plural: 'PCF Organizations'
  }
});
