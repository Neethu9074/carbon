import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import * as constants from 'in-forge/constants';
import iconPath from 'in-forge/plugins/rabbitMq/icon.svg';

pluginName.setHumanReadablePluginName(
    constants.plugins.rabbitmq,
    'RabbitMq',
    'RabbitMq'
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

function getLabel() {
  return 'rabbitMq';
}

addIconToRegistry({
  id: constants.plugins.rabbitmq,
  image: iconPath
});
