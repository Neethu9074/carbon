import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

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
