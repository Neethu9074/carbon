import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/elasticsearchNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.elasticsearchCluster,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.elasticsearchCluster, 'Elasticsearch Cluster', 'Elasticsearch Cluster');

addLabelFinder(plugins.elasticsearchCluster, snapshot => snapshot.getIn(['data', 'groupId']));
