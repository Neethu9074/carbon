import {
  number
} from 'in-services/formatters/number';


export default [
  {
    metrics: [
      'stats.physicalReads'
    ],
    labels: [
      'Physical Reads'
    ],
    min: 0,
    formatter: number
  }
];
