import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.availabilityZone,
  icon,

  pluginName: {
    singular: 'Availability Zone',
    plural: 'Availability Zones'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'groupId']);
  }
});
