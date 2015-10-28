import {addIconFinder, addLabelFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.nodejs,
  'Node.js Runtime',
  'Node.js Runtimes'
);

addLabelFinder(constants.plugins.nodejs, getLabel);

function getLabel(s) {
  const data = s.get('data');
  const nodeJsVersion = data.getIn(['versions', 'node']);
  if (!nodeJsVersion) {
    return getFallbackLabel(s);
  }

  const label = 'Node.js v' + nodeJsVersion;

  const name = data.get('name');
  if (!name) {
    return label;
  }

  return label + ' executing ' + name;
}

function getFallbackLabel(s) {
  return 'Node.js#' + s.get('steadyId');
}

addIconFinder(
  constants.plugins.nodejs,
  () => iconPath
);

zones.addMapping(
  constants.plugins.nodejs,
  snapshot => snapshot.get('hostId')
);

power.addMapping(
  constants.plugins.nodejs,
  () => -1
);

sorting.addMapping(
  constants.plugins.nodejs,
  (s1, s2) => getLabel(s1).localeComparse(getLabel(s2))
);
