import iconSvgPath from 'in-forge/plugins/elasticsearchNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.elasticSearchIndexServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Elasticsearch Index Instance',
    plural: 'Elasticsearch Index Instances'
  },

  chartWiggleRoom: 20000
});
