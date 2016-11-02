import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

registerSnapshotDefinition({
  plugin: plugins.defaultServiceInstance,
  icon,

  pluginName: {
    singular: 'Logical Service Instance',
    plural: 'Logical Service Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
