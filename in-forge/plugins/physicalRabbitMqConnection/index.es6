import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalRabbitMqConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalRabbitMqConnection,
  'Physical Rabbit MQ Connection',
  'Physical Rabbit MQ Connections'
);

addLabelFinder(
  constants.plugins.physicalRabbitMqConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalRabbitMqConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalRabbitMqConnection,
  image: iconPath
});
