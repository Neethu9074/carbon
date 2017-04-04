import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.jetty,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(plugins.jetty, 'Jetty', 'Jetty');
