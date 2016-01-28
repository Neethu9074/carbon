import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.msiis,
  'Internet Information Server',
  'Internet Information Servers'
);


addLabelFinder(
  constants.plugins.msiis,
  () => 'MSIIS'
);

addIconFinder(
  constants.plugins.msiis,
  () => iconPath
);

power.addMapping(
  constants.plugins.msiis,
  () => -1
);
