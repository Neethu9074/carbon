import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/elasticsearchNode/icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.elasticSearchIndexServiceInstance,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Elasticsearch Index Instance',
    plural: 'Elasticsearch Index Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
