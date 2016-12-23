import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalPdoConnection,

  iconSvgPath,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'PDO Connection',
    plural: 'PDO Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
