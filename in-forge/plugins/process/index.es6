import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/process/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.process,
  'Process',
  'Processes'
);

addLabelFinder(constants.plugins.process, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'exec']);
}

addIconToRegistry({
  id: constants.plugins.process,
  image: iconPath
});
