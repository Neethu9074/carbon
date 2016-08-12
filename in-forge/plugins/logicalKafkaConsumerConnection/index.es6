import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalKafkaConsumerConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalKafkaConsumerConnection,
  'Logical Kafka Consumer Connection',
  'Logical Kafka Consumer Connections'
);

addLabelFinder(
  constants.plugins.logicalKafkaConsumerConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalKafkaConsumerConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalKafkaConsumerConnection,
  image: iconPath
});
