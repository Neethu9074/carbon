import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from './icon.svg';
import * as constants from '../constants';

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
