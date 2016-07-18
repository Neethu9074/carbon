import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/physicalMongoDbConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.physicalMongoDbConnection,
  'Physical MongoDB Connection',
  'Physical MongoDB Connections'
);

addLabelFinder(
  constants.plugins.physicalMongoDbConnection,
  snapshot => snapshot.getIn(['data', 'source', 'id']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'id'])
);

power.addMapping(
  constants.plugins.physicalMongoDbConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.physicalMongoDbConnection,
  image: iconPath
});
