import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticsearch,
  'Elasticsearch Node',
  'Elasticsearch Nodes'
);

addLabelFinder(
  constants.plugins.elasticsearch,
  snapshot => snapshot.getIn(['data', 'cluster.name'])
              + '-'
              + snapshot.getIn(['data', 'node.name'])
);

addIconFinder(
  constants.plugins.elasticsearch,
  () => iconPath
);

power.addMapping(
  constants.plugins.elasticsearch,
  () => -1
);
