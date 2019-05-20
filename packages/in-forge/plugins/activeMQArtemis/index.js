import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.activemqartemis,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'ActiveMQ Artemis',
    plural: 'ActiveMQ Artemis'
  },
  technologyDescriptor: {
    label: 'ActiveMQArtemis'
  }
});
