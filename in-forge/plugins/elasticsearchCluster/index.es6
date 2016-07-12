import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/elasticsearchCluster/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticsearchCluster,
  'Elasticsearch Cluster',
  'Elasticsearch Cluster'
);

power.addMapping(
  constants.plugins.elasticsearchCluster,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.elasticsearchCluster,
  image: iconPath
});

addLabelFinder(constants.plugins.elasticsearchCluster, () => 'Elasticsearch Cluster');
