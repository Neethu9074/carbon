import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.mysql,
  icon
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
