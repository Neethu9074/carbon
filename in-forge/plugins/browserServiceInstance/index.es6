import icon from 'in-forge/plugins/browserLogicalService/icon.svg';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.browserServiceInstance,
  icon,

  pluginName: {
    singular: 'TODO: DELETE',
    plural: 'TODO: DELETE'
  },

  getLabel() {
    return 'THIS IS GOING TO BE DELETED';
  }
});
