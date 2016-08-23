import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/genericNodejsApp/icon.svg';
import * as constants from 'in-forge/constants';

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

addIconToRegistry({
  id: constants.plugins.nodejsApp,
  image: iconPath
});

addSearchableEntityType('nodeApp', constants.plugins.nodejsCluster);
addSearchableEntityType('node.jsApp', constants.plugins.nodejsCluster);
addSearchableEntityType('nodejsApp', constants.plugins.nodejsCluster);
