import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';

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
