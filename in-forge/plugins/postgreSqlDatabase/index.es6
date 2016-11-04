import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.postgresql,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.postgresql,
  'PostgreSQL DB',
  'PostgreSQL DBs'
);

addLabelFinder(
  plugins.postgresql,
  snapshot => 'PostgreSQL @ ' + snapshot.getIn(['data', 'port'])
);

addSearchableEntityType('postgresql', plugins.postgresql);
addSearchableEntityType('postgre', plugins.postgresql);
