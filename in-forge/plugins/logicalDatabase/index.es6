import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/tracing/categoryIcons/database.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalDatabase,
  icon,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Logical Database',
    plural: 'Logical Databases'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
