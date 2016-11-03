import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.mongoDbDatabaseServiceInstance,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Logical MongoDB Database',
    plural: 'Logical MongoDB Databases'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
