import * as zones from 'in-sdk/zones';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder, addIconFinder} from 'in-sdk/snapshot';

import iconPath from './icon.svg';
import * as constants from '../constants';

zones.addMapping(
  constants.plugins.nodejsCluster,
  snapshot => snapshot.getIn(['data', 'groupId'])
);

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
