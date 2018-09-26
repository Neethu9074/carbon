import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cap_requests_memory', 'used_requests_memory', 'cap_limits_memory', 'used_limits_memory'],
    labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits ', 'Used Limits'],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: ['cap_requests_cpu', 'used_requests_cpu', 'cap_limits_cpu', 'used_limits_cpu'],
    labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits', 'Used Limits'],
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metrics: ['used_pods', 'cap_pods'],
    labels: ['Used Pods', 'Pods Capacity'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: [
      'used_pods_percentage',
      'required_cpu_percentage',
      'limit_cpu_percentage',
      'required_mem_percentage',
      'limit_mem_percentage'
    ],
    labels: [
      'Pods Allocation',
      'CPU Requests Allocation',
      'CPU Limits Allocation',
      'Memory Requests Allocation',
      'Memory Limits Allocation'
    ],
    min: 0,
    formatter: percentage.detailed
  }
];
