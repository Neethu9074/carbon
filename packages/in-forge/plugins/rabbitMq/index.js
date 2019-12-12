import metricDefinitions from 'in-forge/plugins/rabbitMq/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/rabbitMq/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/rabbitMq/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.rabbitMq,
  pluginName: {
    singular: 'RabbitMQ',
    plural: 'RabbitMQ'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'RabbitMQ'
  }
});
