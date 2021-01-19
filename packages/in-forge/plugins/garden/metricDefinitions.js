/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cpu.total', 'cpu.system', 'cpu.user'],
    labels: ['Total', 'Kernel', 'User'],
    min: 0,
    category: ['CPU'],
    formatter: percentage
  },
  {
    metrics: [
      'memory.usage',
      'memory.total_rss',
      'memory.total_cache',
      'memory.active_anon',
      'memory.active_file',
      'memory.inactive_anon',
      'memory.inactive_file'
    ],
    labels: ['Usage', 'RSS', 'Cache', 'Active Anonymous', 'Active Cache', 'Inactive Anonymous', 'Inactive Cache'],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['disk.totalBytesUsed', 'disk.totalInodesUsed', 'exclusiveBytesUsed', 'exclusiveBytesUsed'],
    labels: ['Total Bytes', 'Total Inodes', 'Exclusive Bytes', 'Exclusive Inodes'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['network.rxBytes', 'network.txBytes'],
    labels: ['Received', 'Transmitted'],
    min: 0,
    category: ['Network'],
    formatter: bytes
  }
];
