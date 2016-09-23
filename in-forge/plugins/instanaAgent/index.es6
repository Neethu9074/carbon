import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.instanaAgent,
  icon
});

setHumanReadablePluginName(
  plugins.jvm,
  'Instana Agent',
  'Instana Agents'
);

addLabelFinder(
  plugins.jvm,
  () => 'Instana Agent'
);
