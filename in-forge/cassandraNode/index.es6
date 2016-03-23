import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from 'in-forge/constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandra,
  'Cassandra Node',
  'Cassandra Nodes'
);

addLabelFinder(
  constants.plugins.cassandra,
  snapshot => snapshot.getIn(['data', 'clusterName'])
              + '-'
              + snapshot.getIn(['data', 'hostId'])
);

power.addMapping(
  constants.plugins.cassandra,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.cassandra,
  image: iconPath
});
