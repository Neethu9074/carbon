import * as ro from 'reactive-observables';

import {
  addLabelFinder,
  addIconFinder,
  addWiredSnapshotFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.nginx,
  'Nginx',
  'Nginx'
);

addLabelFinder(constants.plugins.nginx, getLabel);

addIconFinder(
  constants.plugins.nginx,
  () => iconPath
);

addWiredSnapshotFinder(constants.plugins.nginx, () => ro.create());

power.addMapping(
  constants.plugins.nginx,
  () => -1
);

sorting.addMapping(
  constants.plugins.nginx,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel() {
  return 'Nginx';
}
