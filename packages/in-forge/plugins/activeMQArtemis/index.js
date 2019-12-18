import metricDefinitions from 'in-forge/plugins/activeMQArtemis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/activeMQArtemis/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/activeMQArtemis/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.activeMQArtemis,
  pluginName: {
    singular: 'ActiveMQ Artemis',
    plural: 'ActiveMQ Artemis'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'ActiveMQArtemis'
  }
});
