import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.memcached,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.memcached,
  'Memcached Node',
  'Memcached Nodes'
);

addLabelFinder(
  plugins.memcached,
  snapshot => 'Memcached @' + snapshot.getIn(['data', 'port'])
);

addSearchableEntityType('memcached', plugins.memcached);
