import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/nodeJsCluster/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.nodejsCluster,
  'Node.js Cluster',
  'Node.js Clusters'
);

addLabelFinder(constants.plugins.nodejsCluster, s => s.getIn(['data', 'groupId']));

addIconToRegistry({
  id: constants.plugins.nodejsCluster,
  image: iconPath
});

addSearchableType('nodeCluster', constants.plugins.nodejsCluster);
addSearchableType('node.jsCluster', constants.plugins.nodejsCluster);
addSearchableType('nodejsCluster', constants.plugins.nodejsCluster);
