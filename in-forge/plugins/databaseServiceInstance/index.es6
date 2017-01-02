import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import databaseIconPath from 'in-forge/plugins/databaseServiceInstance/iconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.databaseServiceInstance,

  iconSvgPath: databaseIconPath,
  metricDefinitions,

  pluginName: {
    singular: 'Database Instance',
    plural: 'Database Instances'
  },

  chartWiggleRoom: 20000,

  getIconPath(snapshot) {
    const databaseType = snapshot.getIn(['data', 'physical_endpoint', 'type'], '');
    if (databaseType.match(/mysql/i)) {
      return plugins.mysql;
    } else if (databaseType.match(/postgres/i)) {
      return plugins.postgres;
    }
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
