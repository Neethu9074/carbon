import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/messageBrokerServiceInstance/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.messageBrokerServiceInstance,
  'Logical Message Broker',
  'Logical Message Brokers'
);

addLabelFinder(
  constants.plugins.messageBrokerServiceInstance,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

power.addMapping(
  constants.plugins.messageBrokerServiceInstance,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.messageBrokerServiceInstance,
  image: iconPath
});
