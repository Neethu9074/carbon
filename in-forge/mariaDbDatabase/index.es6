import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/mariaDbDatabase/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.mariaDbDatabase,
  'MariaDB',
  'MariaDBs'
);


addLabelFinder(
  constants.plugins.mariaDbDatabase,
  snapshot => 'MariaDB @' + snapshot.getIn(['data', 'port'])
);

power.addMapping(
  constants.plugins.mariaDbDatabase,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.mariaDbDatabase,
  image: iconPath
});
