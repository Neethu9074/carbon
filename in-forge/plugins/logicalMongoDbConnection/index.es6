import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalMongoDbConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalMongoDbConnection,
  'Logical MongoDB Connection',
  'Logical MongoDB Connections'
);

addLabelFinder(
  constants.plugins.logicalMongoDbConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalMongoDbConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalMongoDbConnection,
  image: iconPath
});
