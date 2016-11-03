import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/cassandraNode/icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.cassandraCluster,
  'Cassandra Cluster',
  'Cassandra Cluster'
);

addLabelFinder(plugins.cassandraCluster, snapshot => snapshot.getIn(['data', 'groupId']));

addSearchableEntityType('cassandraCluster', plugins.cassandraCluster);
