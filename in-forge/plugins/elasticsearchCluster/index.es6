import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';
import * as kpi from 'in-sdk/kpi';

import {withSiPrefixTwoDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import iconPath from 'in-forge/plugins/elasticsearchCluster/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticsearchCluster,
  'Elasticsearch Cluster',
  'Elasticsearch Cluster'
);

power.addMapping(
  constants.plugins.elasticsearchCluster,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.elasticsearchCluster,
  image: iconPath
});

addLabelFinder(constants.plugins.elasticsearchCluster, () => 'Elasticsearch Cluster');

kpi.addMapping(
  constants.plugins.elasticsearchCluster,
  () => [
    {
      metric: 'node_count',
      label: 'Nodes',
      formatter: withSiPrefixTwoDecimalPlaces
    }, {
      metric: 'indices_count',
      label: 'Indices',
      formatter: withSiPrefixTwoDecimalPlaces
    }, {
      metric: 'active_shards_count',
      label: 'Active Shards',
      formatter: withSiPrefixTwoDecimalPlaces
    }, {
      metric: 'document_count',
      label: 'Documents',
      formatter: withSiPrefixTwoDecimalPlaces
    }, {
      metric: 'store_size',
      label: 'Size of store',
      formatter: bytesTwoDecimalPlaces
    }
  ]
);
