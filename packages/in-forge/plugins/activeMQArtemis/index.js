import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/activeMQArtemis/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.activeMQArtemis,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'ActiveMQ Artemis',
    plural: 'ActiveMQ Artemis'
  },
  technologyDescriptor: {
    label: 'ActiveMQArtemis'
  }
});
