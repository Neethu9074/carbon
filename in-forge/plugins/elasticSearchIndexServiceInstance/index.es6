import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/elasticsearchNode/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.elasticSearchIndexServiceInstance,
  icon,

  pluginName: {
    singular: 'Elasticsearch Index Instance',
    plural: 'Elasticsearch Index Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
