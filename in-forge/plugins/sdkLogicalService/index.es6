import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.defaultSdkService,
  'Unspecified Custom Service',
  'Unspecified Custom Services'
);

addLabelFinder(
  constants.plugins.defaultSdkService,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

addIconToRegistry({
  id: constants.plugins.defaultSdkService,
  image: iconPath
});
