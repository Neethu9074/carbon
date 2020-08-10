import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['openInputs', 'openOutputs'],
    labels: ['Open Inputs', 'Open Outputs'],
    min: 0,
    category: ['Open Inputs/Outputs'],
    formatter: number
  }
];
