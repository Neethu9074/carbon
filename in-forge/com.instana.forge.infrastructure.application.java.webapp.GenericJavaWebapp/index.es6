import {addIconFinder, addLabelFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.javaWebApp,
  'JVM Web App',
  'JVM Web Apps'
);

addLabelFinder(constants.plugins.javaWebApp, getLabel);

function getLabel(s) {
  return 'JVM Web App#' + s.get('steadyId');
}

addIconFinder(
  constants.plugins.javaWebApp,
  () => iconPath
);

power.addMapping(
  constants.plugins.javaWebApp,
  () => -1
);

sorting.addMapping(
  constants.plugins.javaWebApp,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);
