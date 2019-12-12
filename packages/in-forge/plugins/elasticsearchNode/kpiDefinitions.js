import { twoDecimalPlaces, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Indices',
    metric: 'indices_count',
    formatter: withSiPrefixThreeDecimalPlaces
  },
  {
    label: 'Active Shards',
    metric: 'shards.node_active_shards',
    formatter: twoDecimalPlaces
  }
];
