import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Requests Allocation',
    metric: 'required_cpu_percentage',
    formatter: percentage.detailed
  },
  {
    label: 'Memory Requests Allocation',
    metric: 'required_mem_percentage',
    formatter: percentage.detailed
  }
];
