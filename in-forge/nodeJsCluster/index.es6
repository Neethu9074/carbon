import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.nodejsCluster,
  'Node.js Cluster',
  'Node.js Clusters'
);

addLabelFinder(constants.plugins.nodejsCluster, s => s.getIn(['data', 'groupId']));

addIconFinder(
  constants.plugins.nodejsCluster,
  () => iconPath
);

addIconToRegistry({
  id: constants.plugins.nodejsCluster,
  image: iconPath
});
