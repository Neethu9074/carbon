import iconPath from 'in-forge/plugins/mariaDbDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';


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

addSearchableType('maria', constants.plugins.mariaDbDatabase);
addSearchableType('mariadb', constants.plugins.mariaDbDatabase);
