import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/golangRuntimePlatform/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.golang,
  icon,
  pluginName: {
    singular: 'Golang App',
    plural: 'Golang Apps'
  },

  namesForTypeSearch: ['go', 'golang'],

  getLabel() {
    return getFallbackLabel();
  }
});


function getFallbackLabel() {
  return 'Unknown Golang App';
}
