import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import * as constants from 'in-forge/constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.process,
  'Process',
  'Processes'
);

addLabelFinder(constants.plugins.process, getLabel);

power.addMapping(
  constants.plugins.process,
  () => -1
);

sorting.addMapping(
  constants.plugins.process,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'exec']);
}

addIconToRegistry({
  id: constants.plugins.process,
  image: iconPath
});
