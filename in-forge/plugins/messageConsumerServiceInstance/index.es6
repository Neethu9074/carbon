import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.messageConsumerServiceInstance,
  'Message Consumer Instance',
  'Message Consumer Instances'
);

addLabelFinder(
  constants.plugins.messageConsumerServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

addIconToRegistry({
  id: constants.plugins.messageConsumerServiceInstance,
  image: iconPath
});
