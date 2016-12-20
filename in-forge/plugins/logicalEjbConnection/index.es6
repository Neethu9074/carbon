import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.logicalEjbConnection,
  icon,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'EJB Connection',
    plural: 'EJB Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
