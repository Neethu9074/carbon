import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/cassandraCluster/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandraCluster,
  'Cassandra Cluster',
  'Cassandra Cluster'
);

addIconToRegistry({
  id: constants.plugins.cassandraCluster,
  image: iconPath
});

addLabelFinder(constants.plugins.cassandraCluster, snapshot => snapshot.getIn(['data', 'groupId']));

addSearchableEntityType('cassandraCluster', constants.plugins.cassandraCluster);
