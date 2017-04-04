import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.javaWebApp,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.javaWebApp, 'JVM Web App', 'JVM Web Apps');
