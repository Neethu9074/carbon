import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/cassandraCluster/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.cassandraCluster,
  'Cassandra Cluster',
  'Cassandra Cluster'
);

addIconToRegistry({
  id: plugins.cassandraCluster,
  image: iconPath
});

addLabelFinder(plugins.cassandraCluster, snapshot => snapshot.getIn(['data', 'groupId']));

addSearchableEntityType('cassandraCluster', plugins.cassandraCluster);
