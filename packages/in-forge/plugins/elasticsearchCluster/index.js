import metricDefinitions from 'in-forge/plugins/elasticsearchCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/elasticsearchCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/elasticsearchNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.elasticsearchCluster,
  pluginName: {
    singular: 'Elasticsearch Cluster',
    plural: 'Elasticsearch Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Elasticsearch'
  }
});
