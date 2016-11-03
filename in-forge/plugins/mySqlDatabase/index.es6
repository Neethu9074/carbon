import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.mysql,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.mysql,
  'MySQL',
  'MySQL DBs'
);


addLabelFinder(
  plugins.mysql,
  snapshot => 'MySQL @' + snapshot.getIn(['data', 'port'])
);

addSearchableEntityType('mysql', plugins.mysql);
