import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Solr Hit Ratio',
    metric: 'hitratio',
    formatter: number.compact
  },
  {
    label: 'Solr Evictions',
    metric: 'evictions',
    formatter: number.compact
  }
];
