import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/logicalKafkaPublisherConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalKafkaPublisherConnection,
  'Logical Kafka Publisher Connection',
  'Logical Kafka Publisher Connections'
);

addLabelFinder(
  constants.plugins.logicalKafkaPublisherConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

addIconToRegistry({
  id: constants.plugins.logicalKafkaPublisherConnection,
  image: iconPath
});
