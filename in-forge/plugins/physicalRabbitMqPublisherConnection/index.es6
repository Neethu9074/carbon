import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalRabbitMqPublisherConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalRabbitMqPublisherConnection,
  'Physical Rabbit MQ Publisher Connection',
  'Physical Rabbit MQ Publisher Connections'
);

addLabelFinder(
  constants.plugins.physicalRabbitMqPublisherConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalRabbitMqPublisherConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalRabbitMqPublisherConnection,
  image: iconPath
});
