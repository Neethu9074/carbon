import * as pluginName from 'in-sdk/pluginName';
import {addIconFinder} from 'in-sdk/snapshot';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandraCluster,
  'Cassandra Cluster',
  'Cassandra Cluster'
);

addIconFinder(
  constants.plugins.cassandraCluster,
  () => iconPath
);

zones.addMapping(
  constants.plugins.cassandraCluster,
  snapshot => snapshot.get('hostId')
);

power.addMapping(
  constants.plugins.cassandraCluster,
  () => -1
);
