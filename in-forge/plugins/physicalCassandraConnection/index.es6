import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalCassandraConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalCassandraConnection,
  'Physical Cassandra Connection',
  'Physical Cassandra Connections'
);

addLabelFinder(
  constants.plugins.physicalCassandraConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalCassandraConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalCassandraConnection,
  image: iconPath
});
