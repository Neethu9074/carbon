import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/cassandraCluster/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandraCluster,
  'Cassandra Cluster',
  'Cassandra Cluster'
);

power.addMapping(
  constants.plugins.cassandraCluster,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.cassandraCluster,
  image: iconPath
});

addLabelFinder(constants.plugins.cassandraCluster, () => 'Cassandra Cluster');
