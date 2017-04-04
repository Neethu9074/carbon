import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/elasticsearchNode/iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalElasticSearchIndex,

  iconSvgPath,
  namesForTypeSearch: ['service'],
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'Elasticsearch Index',
    plural: 'Elasticsearch Indices'
  },

  chartWiggleRoom: 20000
});
