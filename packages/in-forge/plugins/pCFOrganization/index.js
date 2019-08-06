import iconSvgPath from 'in-forge/plugins/pCFOrganization/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFOrganization,
  iconSvgPath,
  pluginName: {
    singular: 'PCF Organization',
    plural: 'PCF Organizations'
  }
});
