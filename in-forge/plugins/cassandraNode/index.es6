import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.cassandra,
  icon
});

setHumanReadablePluginName(
  plugins.cassandra,
  'Cassandra Node',
  'Cassandra Nodes'
);

addLabelFinder(
  plugins.cassandra,
  snapshot => snapshot.getIn(['data', 'clusterName'])
              + '-'
              + snapshot.getIn(['data', 'hostId'])
);

addSearchableEntityType('cassandra', plugins.cassandra);
