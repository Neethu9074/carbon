import iconPath from 'in-forge/plugins/rabbitMq/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';


pluginName.setHumanReadablePluginName(
  constants.plugins.rabbitmq,
  'RabbitMQ',
  'RabbitMQ'
);

addLabelFinder(constants.plugins.rabbitmq, getLabel);

power.addMapping(
  constants.plugins.rabbitmq,
  () => -1
);

sorting.addMapping(
  constants.plugins.rabbitmq,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel(snapshot) {
  return 'RabbitMQ ' + snapshot.getIn(['data', 'overview.version']);
}

addIconToRegistry({
  id: constants.plugins.rabbitmq,
  image: iconPath
});

addSearchableType('rabbit', constants.plugins.rabbitmq);
addSearchableType('rabbitmq', constants.plugins.rabbitmq);
