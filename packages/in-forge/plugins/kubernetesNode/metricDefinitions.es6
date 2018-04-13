import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metric: 'alloc_pods',
    label: 'Allocatable Pods',
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'cap_cpu',
    label: 'CPU Capacity',
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metric: 'cap_mem',
    label: 'Memory Capacity',
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metric: 'cap_pods',
    label: 'Pod Capacity',
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'required_cpu',
    label: 'CPU Required',
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metric: 'limit_cpu',
    label: 'CPU Limit',
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metric: 'required_mem',
    label: 'Memory Required',
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metric: 'limit_mem',
    label: 'Memory Limit',
    min: 0,
    formatter: bytesTwoDecimalPlaces
  }
];
