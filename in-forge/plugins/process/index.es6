import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.process,
  icon
});

setHumanReadablePluginName(
  plugins.process,
  'Process',
  'Processes'
);

addLabelFinder(plugins.process, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'exec']);
}
