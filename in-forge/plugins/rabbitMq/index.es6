import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.rabbitmq,
  icon
});

setHumanReadablePluginName(
  plugins.rabbitmq,
  'RabbitMQ',
  'RabbitMQ'
);

addLabelFinder(plugins.rabbitmq, getLabel);

function getLabel(snapshot) {
  return 'RabbitMQ ' + snapshot.getIn(['data', 'overview.version']);
}

addSearchableEntityType('rabbit', plugins.rabbitmq);
addSearchableEntityType('rabbitmq', plugins.rabbitmq);
