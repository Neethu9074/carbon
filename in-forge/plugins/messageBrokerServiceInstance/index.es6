import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as icon from 'in-sdk/iconRegistry';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/messageBrokerServiceInstance/icon.svg';
import rabbitMqIcon from 'in-forge/plugins/rabbitMq/icon.svg';
import kafkaIcon from 'in-forge/plugins/kafka/icon.svg';

import * as constants from 'in-forge/constants';


pluginName.setHumanReadablePluginName(
  constants.plugins.messageBrokerServiceInstance,
  'Message Broker Instance',
  'Message Broker Instances'
);

addLabelFinder(
  constants.plugins.messageBrokerServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

power.addMapping(
  constants.plugins.messageBrokerServiceInstance,
  () => -1
);


icon.addIconsToRegistry([ {
    id: constants.plugins.messageBrokerServiceInstance + '_kafka',
    image: kafkaIcon
  }, {
    id: constants.plugins.messageBrokerServiceInstance + '_rabbitmq',
    image: rabbitMqIcon
  }, {
    id: constants.plugins.messageBrokerServiceInstance,
    image: iconPath
  }
]);

icon.addMapping(
  constants.plugins.messageBrokerServiceInstance,
  snapshot => {
    let type = snapshot.get('plugin');

    const messageBrokerPlugin = constants.plugins.messageBrokerServiceInstance;
    if (type === messageBrokerPlugin) {
      type = messageBrokerPlugin;
      const messageBrokerType = snapshot.getIn(['data', 'physical_endpoint', 'type']);

      if (messageBrokerType) {
        if (messageBrokerType.match(/kafka/i)) {
          type = messageBrokerPlugin + '_kafka';
        } else if (messageBrokerType.match(/rabbitmq/i)) {
          type = messageBrokerPlugin + '_rabbitmq';
        }
      }
    }
    return type;
  }
);
