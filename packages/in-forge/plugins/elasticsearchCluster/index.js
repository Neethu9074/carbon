import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/elasticsearchCluster/kpiDefinitions';

import iconSvgPath from 'in-forge/plugins/elasticsearchNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.elasticsearchCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Elasticsearch Cluster',
    plural: 'Elasticsearch Clusters'
  },
  technologyDescriptor: {
    label: 'Elasticsearch'
  }
});
