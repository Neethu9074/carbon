import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/genericJavaWebapp/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.javaWebApp,
  'JVM Web App',
  'JVM Web Apps'
);

addLabelFinder(plugins.javaWebApp, getLabel);

function getLabel(s) {
  return 'JVM Web App#' + s.get('steadyId');
}

addIconToRegistry({
  id: plugins.javaWebApp,
  image: iconPath
});
