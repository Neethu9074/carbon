import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.instanaAgent,
  icon,

  pluginName: {
    singular: 'Instana Agent',
    plural: 'Instana Agents'
  },

  getLabel() {
    return 'Instana Agent';
  }
});
