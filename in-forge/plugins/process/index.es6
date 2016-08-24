import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/process/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.process,
  'Process',
  'Processes'
);

addLabelFinder(plugins.process, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'exec']);
}

addIconToRegistry({
  id: plugins.process,
  image: iconPath
});
