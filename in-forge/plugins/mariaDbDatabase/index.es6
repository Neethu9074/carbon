import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.mariaDbDatabase,
  icon
});


setHumanReadablePluginName(
  plugins.mariaDbDatabase,
  'MariaDB',
  'MariaDBs'
);


addLabelFinder(
  plugins.mariaDbDatabase,
  snapshot => 'MariaDB @' + snapshot.getIn(['data', 'port'])
);

addSearchableEntityType('maria', plugins.mariaDbDatabase);
addSearchableEntityType('mariadb', plugins.mariaDbDatabase);
