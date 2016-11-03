import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/tracing/categoryIcons/database.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.databaseServiceInstance,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Database Instance',
    plural: 'Database Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  },

  getIcon(snapshot) {
    let type = snapshot.get('plugin');

    const databasePlugin = plugins.databaseServiceInstance;
    if (type === databasePlugin) {
      type = databasePlugin;
      const databaseType = snapshot.getIn(['data', 'physical_endpoint', 'type']);

      if (databaseType) {
        if (databaseType.match(/mysql/i)) {
          return plugins.mysql;
        } else if (databaseType.match(/postgres/i)) {
          return plugins.postgresql;
        }
      }
    }

    return type;
  }
});
