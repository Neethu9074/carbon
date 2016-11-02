import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/mongoDb/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalMongoDbDatabase,
  icon,

  pluginName: {
    singular: 'Logical MongoDB Database',
    plural: 'Logical MongoDB Databases'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
