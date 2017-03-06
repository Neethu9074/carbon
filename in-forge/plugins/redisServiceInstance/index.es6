import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/redis/iconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.redisServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Redis Database',
    plural: 'Redis Databases'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
