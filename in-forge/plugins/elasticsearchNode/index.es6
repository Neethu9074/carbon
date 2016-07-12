import {withSiPrefixTwoDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';
import * as kpi from 'in-sdk/kpi';

import iconPath from 'in-forge/plugins/elasticsearchNode/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticsearch,
  'Elasticsearch Node',
  'Elasticsearch Nodes'
);

addLabelFinder(
  constants.plugins.elasticsearch,
  snapshot => snapshot.getIn(['data', 'cluster.name'])
              + '-'
              + snapshot.getIn(['data', 'node.name'])
);

power.addMapping(
  constants.plugins.elasticsearch,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.elasticsearch,
  image: iconPath
});

addSearchableType('elastic', constants.plugins.elasticsearch);
addSearchableType('elasticsearch', constants.plugins.elasticsearch);

kpi.addMapping(
  constants.plugins.elasticsearch,
  () => [
    {
      metric: 'indices_count',
      label: 'Indices',
      formatter: withSiPrefixTwoDecimalPlaces
    }, {
      metric: 'shards.node_active_shards',
      label: 'Active Shards',
      formatter: withSiPrefixTwoDecimalPlaces
    }, {
      metric: 'indices.document_count',
      label: 'Documents',
      formatter: withSiPrefixTwoDecimalPlaces
    }, {
      metric: 'indices.store_size',
      label: 'Size of store',
      formatter: bytesTwoDecimalPlaces
    }
  ]
);
