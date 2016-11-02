import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/elasticsearchNode/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalElasticSearchIndex,
  icon,
  namesForTypeSearch: ['service'],
  tableDefinition,

  pluginName: {
    singular: 'Logical Elasticsearch Index',
    plural: 'Logical Elasticsearch Indices'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
