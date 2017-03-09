import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import iconSvgPath from 'in-sdk/unknownIconPath';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.logicalFtpConnection,

  iconSvgPath,
  metricDefinitions,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Logical FTP Connection',
    plural: 'Logical FTP Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
