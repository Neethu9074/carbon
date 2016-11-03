import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.messageConsumerServiceInstance,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Message Consumer Instance',
    plural: 'Message Consumer Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
