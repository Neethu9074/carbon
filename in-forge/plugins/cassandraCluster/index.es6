import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/cassandraNode/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,
  icon
});

setHumanReadablePluginName(
  plugins.cassandraCluster,
  'Cassandra Cluster',
  'Cassandra Cluster'
);

addLabelFinder(plugins.cassandraCluster, snapshot => snapshot.getIn(['data', 'groupId']));

addSearchableEntityType('cassandraCluster', plugins.cassandraCluster);
