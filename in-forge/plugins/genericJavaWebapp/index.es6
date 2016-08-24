import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.javaWebApp,
  icon
});

setHumanReadablePluginName(
  plugins.javaWebApp,
  'JVM Web App',
  'JVM Web Apps'
);

addLabelFinder(plugins.javaWebApp, getLabel);

function getLabel(s) {
  return 'JVM Web App#' + s.get('steadyId');
}
