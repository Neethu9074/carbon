import {addIconFinder, addLabelFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.nodejsApp,
  'Node.js App',
  'Node.js Apps'
);

addLabelFinder(constants.plugins.nodejsApp, getLabel);

function getLabel(s) {
  const data = s.get('data');
  if (!data) {
    return getFallbackLabel(s);
  }

  const name = data.get('name');
  if (!name) {
    return getFallbackLabel(s);
  }

  let label = name;
  const version = data.get('version');
  if (version) {
    label = label + '@' + version;
  }

  return label;
}

function getFallbackLabel(s) {
  return 'Node.js App#' + s.get('steadyId');
}

addIconFinder(
  constants.plugins.nodejsApp,
  () => iconPath
);

power.addMapping(
  constants.plugins.nodejsApp,
  () => -1
);

sorting.addMapping(
  constants.plugins.nodejsApp,
  (s1, s2) => getLabel(s1).localeComparse(getLabel(s2))
);
