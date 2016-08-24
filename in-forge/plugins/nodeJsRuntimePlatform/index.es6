import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/nodeJsRuntimePlatform/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.nodejs,
  'Node.js Runtime',
  'Node.js Runtimes'
);

addLabelFinder(plugins.nodejs, getLabel);

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

addIconToRegistry({
  id: plugins.nodejs,
  image: iconPath
});

addSearchableEntityType('node', plugins.nodejs);
addSearchableEntityType('node.js', plugins.nodejs);
addSearchableEntityType('nodejs', plugins.nodejs);
