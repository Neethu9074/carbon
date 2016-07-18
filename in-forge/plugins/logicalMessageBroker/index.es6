import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalMessageBroker/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalMessageBroker,
  'Logical Message Broker',
  'Logical Message Brokers'
);

addLabelFinder(
  constants.plugins.logicalMessageBroker,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalMessageBroker,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalMessageBroker,
  image: iconPath
});
