import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/elasticsearchNode/icon.svg';
import {plugins} from 'in-forge/constants';

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

addIconToRegistry({
  id: plugins.elasticsearch,
  image: iconPath
});

addSearchableEntityType('elastic', plugins.elasticsearch);
addSearchableEntityType('elasticsearch', plugins.elasticsearch);
