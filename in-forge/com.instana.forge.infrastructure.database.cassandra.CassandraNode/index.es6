import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandra,
  'Cassandra Node',
  'Cassandra Nodes'
);

addLabelFinder(
  constants.plugins.cassandra,
  snapshot => snapshot.getIn(['data', 'clusterName'])
              + '-'
              + snapshot.getIn(['data', 'hostId'])
);

addIconFinder(
  constants.plugins.cassandra,
  () => iconPath
);

power.addMapping(
  constants.plugins.cassandra,
  () => -1
);
