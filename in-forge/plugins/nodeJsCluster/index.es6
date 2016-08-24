import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/nodeJsCluster/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.nodejsCluster,
  'Node.js Cluster',
  'Node.js Clusters'
);

addLabelFinder(plugins.nodejsCluster, s => s.getIn(['data', 'groupId']));

addIconToRegistry({
  id: plugins.nodejsCluster,
  image: iconPath
});

addSearchableEntityType('nodeCluster', plugins.nodejsCluster);
addSearchableEntityType('node.jsCluster', plugins.nodejsCluster);
addSearchableEntityType('nodejsCluster', plugins.nodejsCluster);
