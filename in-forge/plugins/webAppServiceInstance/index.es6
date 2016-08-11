import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.webAppServiceInstance,
  'WebApp Instance',
  'WebApp Instances'
);

addLabelFinder(
  constants.plugins.webAppServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

addIconToRegistry({
  id: constants.plugins.webAppServiceInstance,
  image: iconPath
});
