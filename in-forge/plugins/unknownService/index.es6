import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as icon from 'in-sdk/iconRegistry';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.unknownService,
  'Unknown Service',
  'Unknown Services'
);

addLabelFinder(constants.plugins.unknownService, s => s.getIn(['data', 'service_name']));

icon.addIconToRegistry({
  id: constants.plugins.unknownService,
  image: iconPath
});
