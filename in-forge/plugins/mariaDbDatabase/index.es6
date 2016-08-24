import iconPath from 'in-forge/plugins/mariaDbDatabase/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


setHumanReadablePluginName(
  plugins.mariaDbDatabase,
  'MariaDB',
  'MariaDBs'
);


addLabelFinder(
  plugins.mariaDbDatabase,
  snapshot => 'MariaDB @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: plugins.mariaDbDatabase,
  image: iconPath
});

addSearchableEntityType('maria', plugins.mariaDbDatabase);
addSearchableEntityType('mariadb', plugins.mariaDbDatabase);
