import iconSvgPath from 'in-forge/plugins/browserLogicalService/iconPath';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.browserServiceInstance,

  iconSvgPath,

  pluginName: {
    singular: 'TODO: DELETE',
    plural: 'TODO: DELETE'
  },

  getLabel() {
    return 'THIS IS GOING TO BE DELETED';
  }
});
