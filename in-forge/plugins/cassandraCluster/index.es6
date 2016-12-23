import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/cassandraNode/iconPath';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.cassandraCluster,
  'Cassandra Cluster',
  'Cassandra Cluster'
);

addLabelFinder(plugins.cassandraCluster, snapshot => snapshot.getIn(['data', 'groupId']));

addSearchableEntityType('cassandraCluster', plugins.cassandraCluster);
