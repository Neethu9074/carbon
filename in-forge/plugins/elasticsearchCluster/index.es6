import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/elasticsearchCluster/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.elasticsearchCluster,
  'Elasticsearch Cluster',
  'Elasticsearch Cluster'
);

addIconToRegistry({
  id: plugins.elasticsearchCluster,
  image: iconPath
});

addLabelFinder(plugins.elasticsearchCluster, snapshot => snapshot.getIn(['data', 'groupId']));
