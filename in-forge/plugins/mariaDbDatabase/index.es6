import iconPath from 'in-forge/plugins/mariaDbDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


pluginName.setHumanReadablePluginName(
  constants.plugins.mariaDbDatabase,
  'MariaDB',
  'MariaDBs'
);


addLabelFinder(
  constants.plugins.mariaDbDatabase,
  snapshot => 'MariaDB @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: constants.plugins.mariaDbDatabase,
  image: iconPath
});

addSearchableEntityType('maria', constants.plugins.mariaDbDatabase);
addSearchableEntityType('mariadb', constants.plugins.mariaDbDatabase);
