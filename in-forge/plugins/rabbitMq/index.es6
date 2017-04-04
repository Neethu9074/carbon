import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.rabbitmq,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.rabbitmq, 'RabbitMQ', 'RabbitMQ');

addSearchableEntityType('rabbit', plugins.rabbitmq);
addSearchableEntityType('rabbitmq', plugins.rabbitmq);
