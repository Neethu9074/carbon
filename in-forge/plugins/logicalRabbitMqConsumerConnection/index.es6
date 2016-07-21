import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalRabbitMqConsumerConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalRabbitMqConsumerConnection,
  'Logical Rabbit MQ Consumer Connection',
  'Logical Rabbit MQ Consumer Connections'
);

addLabelFinder(
  constants.plugins.logicalRabbitMqConsumerConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalRabbitMqConsumerConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalRabbitMqConsumerConnection,
  image: iconPath
});
