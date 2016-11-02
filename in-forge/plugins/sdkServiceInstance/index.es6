import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

registerSnapshotDefinition({
  plugin: plugins.sdkServiceInstance,
  icon,

  pluginName: {
    singular: 'Unspecified Custom Service Instance',
    plural: 'Unspecified Custom Service Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
