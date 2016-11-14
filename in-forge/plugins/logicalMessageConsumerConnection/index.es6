import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/logicalMessagePublisherConnection/icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.logicalMessageConsumerConnection,
  icon,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Message Consumer Connection',
    plural: 'Message Consumer Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
