import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandraKeyspaceServiceInstance,
  'Logical Cassandra Keyspace',
  'Logical Cassandra Keyspaces'
);

addLabelFinder(
  constants.plugins.cassandraKeyspaceServiceInstance,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

addIconToRegistry({
  id: constants.plugins.cassandraKeyspaceServiceInstance,
  image: iconPath
});
