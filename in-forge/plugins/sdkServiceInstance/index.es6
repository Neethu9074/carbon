import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.sdkServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Custom Service Instance',
    plural: 'Custom Service Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
