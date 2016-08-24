import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/cassandraNode/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.cassandra,
  'Cassandra Node',
  'Cassandra Nodes'
);

addLabelFinder(
  plugins.cassandra,
  snapshot => snapshot.getIn(['data', 'clusterName'])
              + '-'
              + snapshot.getIn(['data', 'hostId'])
);

addIconToRegistry({
  id: plugins.cassandra,
  image: iconPath
});

addSearchableEntityType('cassandra', plugins.cassandra);
