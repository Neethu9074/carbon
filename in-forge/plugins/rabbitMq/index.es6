import iconPath from 'in-forge/plugins/rabbitMq/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

pluginName.setHumanReadablePluginName(
  constants.plugins.rabbitmq,
  'RabbitMQ',
  'RabbitMQ'
);

addLabelFinder(constants.plugins.rabbitmq, getLabel);

function getLabel(snapshot) {
  return 'RabbitMQ ' + snapshot.getIn(['data', 'overview.version']);
}

addIconToRegistry({
  id: constants.plugins.rabbitmq,
  image: iconPath
});

addSearchableEntityType('rabbit', constants.plugins.rabbitmq);
addSearchableEntityType('rabbitmq', constants.plugins.rabbitmq);
