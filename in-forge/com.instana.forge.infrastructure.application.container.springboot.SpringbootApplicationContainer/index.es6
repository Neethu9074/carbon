import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.springboot,
  'Springboot',
  'Springboot'
);

addLabelFinder(
  constants.plugins.springboot,
  snapshot => snapshot.getIn(['data', 'version'])
);

addIconFinder(
  constants.plugins.springboot,
  () => iconPath
);

power.addMapping(
  constants.plugins.springboot,
  () => -1
);
