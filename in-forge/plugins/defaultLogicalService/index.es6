import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

registerSnapshotDefinition({
  plugin: plugins.defaultLogicalService,
  icon,
  namesForTypeSearch: ['service'],

  pluginName: {
    singular: 'Unspecified Logical Service',
    plural: 'Unspecified Logical Services'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
