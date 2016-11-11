import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/mongoDb/icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.mongoDbDatabaseServiceInstance,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'MongoDB Database',
    plural: 'MongoDB Databases'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
