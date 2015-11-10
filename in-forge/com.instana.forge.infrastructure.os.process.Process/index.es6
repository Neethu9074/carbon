import * as ro from 'reactive-observables';

import {
  addLabelFinder,
  addIconFinder,
  addWiredSnapshotFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.process,
  'Process',
  'Processes'
);

addLabelFinder(constants.plugins.process, getLabel);

addIconFinder(
  constants.plugins.process,
  () => iconPath
);

addWiredSnapshotFinder(constants.plugins.process, () => ro.create());

zones.addMapping(
  constants.plugins.process,
  snapshot => snapshot.get('hostId')
);

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
