import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.rabbitMq,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'RabbitMQ',
    plural: 'RabbitMQ'
  },
  technologyDescriptor: {
    label: 'RabbitMQ'
  }
});
