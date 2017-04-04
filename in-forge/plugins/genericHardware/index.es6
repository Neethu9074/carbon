import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.genericHardware,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.genericHardware, 'Generic Hardware', 'Generic Hardware');
