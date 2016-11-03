import {
  percentage,
  bytes
} from 'in-services/formatters/number';


export default [
  {
    metrics: [
      'mem.virtual',
      'mem.resident',
      'mem.share'
    ],
    labels: [
      'Virtual',
      'Resident',
      'Share'
    ],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: [
      'cpu.user',
      'cpu.sys'
    ],
    labels: [
      'User',
      'System'
    ],
    min: 0,
    category: ['CPU Usage'],
    formatter: percentage
  }
];
