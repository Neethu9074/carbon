import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';


registerSnapshotDefinition({
  plugin: plugins.javaMailLogicalConnection,

  iconSvgPath,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Java Mail Connection',
    plural: 'Java Mail Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
           ' to ' +
           snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
