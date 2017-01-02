import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.mariaDbDatabase,

  iconSvgPath,
  metricDefinitions
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
