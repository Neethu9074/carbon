import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
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

addSearchableEntityType('nodeCluster', constants.plugins.nodejsCluster);
addSearchableEntityType('node.jsCluster', constants.plugins.nodejsCluster);
addSearchableEntityType('nodejsCluster', constants.plugins.nodejsCluster);
