import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

registerSnapshotDefinition({
  plugin: plugins.sdkLogicalService,
  icon,

  pluginName: {
    singular: 'Unspecified Custom Service',
    plural: 'Unspecified Custom Services'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
