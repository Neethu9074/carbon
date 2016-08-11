import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';


pluginName.setHumanReadablePluginName(
  constants.plugins.defaultServiceInstance,
  'Unspecified Logical Service Instance',
  'Unspecified Logical Service Instances'
);

addLabelFinder(
  constants.plugins.defaultServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

addIconToRegistry({
  id: constants.plugins.defaultServiceInstance,
  image: iconPath
});
