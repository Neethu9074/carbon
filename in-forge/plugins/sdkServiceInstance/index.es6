import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';


pluginName.setHumanReadablePluginName(
  constants.plugins.sdkServiceInstance,
  'Unspecified Custom Service Instance',
  'Unspecified Custom Service Instances'
);

addLabelFinder(
  constants.plugins.sdkServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

addIconToRegistry({
  id: constants.plugins.sdkServiceInstance,
  image: iconPath
});
