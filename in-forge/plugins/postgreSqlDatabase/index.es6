import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
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

addLabelFinder(plugins.postgresql, snapshot => 'PostgreSQL @ ' + snapshot.getIn(['data', 'port']));

addSearchableEntityType('postgresql', plugins.postgresql);
addSearchableEntityType('postgre', plugins.postgresql);
