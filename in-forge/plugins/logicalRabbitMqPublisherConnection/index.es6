import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalRabbitMqPublisherConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalRabbitMqPublisherConnection,
  'Logical Rabbit MQ Publisher Connection',
  'Logical Rabbit MQ Publisher Connections'
);

addLabelFinder(
  constants.plugins.logicalRabbitMqPublisherConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalRabbitMqPublisherConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalRabbitMqPublisherConnection,
  image: iconPath
});
