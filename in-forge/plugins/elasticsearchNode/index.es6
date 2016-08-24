import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.elasticsearch,
  icon
});

setHumanReadablePluginName(
  plugins.elasticsearch,
  'Elasticsearch Node',
  'Elasticsearch Nodes'
);

addLabelFinder(
  plugins.elasticsearch,
  snapshot => snapshot.getIn(['data', 'cluster.name'])
              + '-'
              + snapshot.getIn(['data', 'node.name'])
);

addSearchableEntityType('elastic', plugins.elasticsearch);
addSearchableEntityType('elasticsearch', plugins.elasticsearch);
