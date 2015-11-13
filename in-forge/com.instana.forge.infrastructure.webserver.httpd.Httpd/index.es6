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
  constants.plugins.httpd,
  'Apache Httpd',
  'Apache Httpds'
);

addLabelFinder(constants.plugins.httpd, getLabel);

addIconFinder(
  constants.plugins.httpd,
  () => iconPath
);

addWiredSnapshotFinder(constants.plugins.httpd, () => ro.create());

power.addMapping(
  constants.plugins.httpd,
  () => -1
);

sorting.addMapping(
  constants.plugins.httpd,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'version']);
}
