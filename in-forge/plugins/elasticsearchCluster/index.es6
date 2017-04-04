import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/elasticsearchNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.elasticsearchCluster,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.elasticsearchCluster, 'Elasticsearch Cluster', 'Elasticsearch Cluster');
