import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.defaultServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Service Instance',
    plural: 'Service Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
