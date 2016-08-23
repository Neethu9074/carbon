import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';

import iconPath from 'in-forge/plugins/genericJavaWebapp/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.javaWebApp,
  'JVM Web App',
  'JVM Web Apps'
);

addLabelFinder(constants.plugins.javaWebApp, getLabel);

function getLabel(s) {
  return 'JVM Web App#' + s.get('steadyId');
}

sorting.addMapping(
  constants.plugins.javaWebApp,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

addIconToRegistry({
  id: constants.plugins.javaWebApp,
  image: iconPath
});
