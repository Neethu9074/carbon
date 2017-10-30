import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metric: 'alloc_cpu',
    label: 'Allocatable CPU',
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metric: 'alloc_mem',
    label: 'Allocatable Memory',
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
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
  }
];
