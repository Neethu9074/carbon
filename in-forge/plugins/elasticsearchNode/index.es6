import {addSearchableType} from 'in-sdk/search';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/elasticsearchNode/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticsearch,
  'Elasticsearch Node',
  'Elasticsearch Nodes'
);

addLabelFinder(
  constants.plugins.elasticsearch,
  snapshot => snapshot.getIn(['data', 'cluster.name'])
              + '-'
              + snapshot.getIn(['data', 'node.name'])
);

power.addMapping(
  constants.plugins.elasticsearch,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.elasticsearch,
  image: iconPath
});

addSearchableType('elastic', constants.plugins.elasticsearch);
addSearchableType('elasticsearch', constants.plugins.elasticsearch);
