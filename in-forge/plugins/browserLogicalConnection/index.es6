import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';


registerSnapshotDefinition({
  plugin: plugins.browserLogicalConnection,

  iconSvgPath,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Browser Connection',
    plural: 'Browser Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
           ' to ' +
           snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
