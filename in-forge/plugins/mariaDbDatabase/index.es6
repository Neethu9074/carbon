import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.mariaDbDatabase,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.mariaDbDatabase, 'MariaDB', 'MariaDBs');

addSearchableEntityType('maria', plugins.mariaDbDatabase);
addSearchableEntityType('mariadb', plugins.mariaDbDatabase);
