import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/genericNodejsApp/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.nodejsApp,
  'Node.js App',
  'Node.js Apps'
);

addLabelFinder(plugins.nodejsApp, getLabel);

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
  id: plugins.nodejsApp,
  image: iconPath
});

addSearchableEntityType('nodeApp', plugins.nodejsCluster);
addSearchableEntityType('node.jsApp', plugins.nodejsCluster);
addSearchableEntityType('nodejsApp', plugins.nodejsCluster);
