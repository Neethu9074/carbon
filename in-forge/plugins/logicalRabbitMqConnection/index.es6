import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalRabbitMqConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalRabbitMqConnection,
  'Logical Rabbit MQ Connection',
  'Logical Rabbit MQ Connections'
);

addLabelFinder(
  constants.plugins.logicalRabbitMqConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalRabbitMqConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalRabbitMqConnection,
  image: iconPath
});
