import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.unknownService,
  'Unknown Service',
  'Unknown Services'
);

addLabelFinder(constants.plugins.unknownService, s => s.getIn(['data', 'service_name']));

addIconToRegistry({
  id: constants.plugins.unknownService,
  image: iconPath
});
