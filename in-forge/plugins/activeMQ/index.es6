import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.activemq,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'ActiveMQ',
    plural: 'ActiveMQs'
  },

  namesForTypeSearch: ['activemq']
});
