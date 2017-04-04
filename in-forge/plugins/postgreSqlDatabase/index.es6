import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.postgresql,
  iconSvgPath,

  metricDefinitions
});

setHumanReadablePluginName(plugins.postgresql, 'PostgreSQL DB', 'PostgreSQL DBs');

addSearchableEntityType('postgresql', plugins.postgresql);
addSearchableEntityType('postgre', plugins.postgresql);
