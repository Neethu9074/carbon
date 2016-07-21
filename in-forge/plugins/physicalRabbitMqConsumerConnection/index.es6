import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalRabbitMqConsumerConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalRabbitMqConsumerConnection,
  'Physical Rabbit MQ Consumer Connection',
  'Physical Rabbit MQ Consumer Connections'
);

addLabelFinder(
  constants.plugins.physicalRabbitMqConsumerConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalRabbitMqConsumerConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalRabbitMqConsumerConnection,
  image: iconPath
});
