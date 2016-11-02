import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

registerSnapshotDefinition({
  plugin: plugins.defaultLogicalService,
  icon,
  namesForTypeSearch: ['service'],
  tableDefinition,

  pluginName: {
    singular: 'Logical Service',
    plural: 'Logical Services'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
