import iconPath from 'in-forge/plugins/rabbitMq/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

setHumanReadablePluginName(
  plugins.rabbitmq,
  'RabbitMQ',
  'RabbitMQ'
);

addLabelFinder(plugins.rabbitmq, getLabel);

function getLabel(snapshot) {
  return 'RabbitMQ ' + snapshot.getIn(['data', 'overview.version']);
}

addIconToRegistry({
  id: plugins.rabbitmq,
  image: iconPath
});

addSearchableEntityType('rabbit', plugins.rabbitmq);
addSearchableEntityType('rabbitmq', plugins.rabbitmq);
