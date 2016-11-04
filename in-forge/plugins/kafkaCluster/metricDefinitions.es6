import {
  siPrefix
} from 'in-services/formatters/number';


export default [
  {
    metric: 'nodeCount',
    label: 'Nodes',
    min: 0,
    formatter: siPrefix
  }
];
