import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.genericHardware,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.genericHardware,
  'Generic Hardware',
  'Generic Hardware'
);

addLabelFinder(
  plugins.genericHardware,
  () => 'Generic Hardware'
);
