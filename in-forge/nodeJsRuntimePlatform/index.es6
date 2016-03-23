import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/nodeJsRuntimePlatform/icon.svg';
import * as constants from 'in-forge/constants';

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

power.addMapping(
  constants.plugins.nodejs,
  () => -1
);

sorting.addMapping(
  constants.plugins.nodejs,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

addIconToRegistry({
  id: constants.plugins.nodejs,
  image: iconPath
});
