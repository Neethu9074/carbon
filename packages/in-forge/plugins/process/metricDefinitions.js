/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage, bytes, number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['mem.virtual', 'mem.resident', 'mem.share'],
    labels: ['Virtual', 'Resident', 'Share'],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['cpu.user', 'cpu.sys'],
    labels: ['User', 'System'],
    min: 0,
    category: ['CPU Usage'],
    formatter: percentage
  },
  {
    metrics: ['ctx_switches.voluntary', 'ctx_switches.nonvoluntary'],
    labels: ['Voluntary', 'Nonvoluntary'],
    min: 0,
    category: ['Context switches'],
    formatter: number
  },
  {
    metric: 'openFiles.current',
    label: 'Current',
    category: ['Open Files'],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'openFiles.max']);
    },
    formatter: number
  },
  {
    metric: 'openFiles.used',
    label: 'Used',
    category: ['Open Files'],
    min: 0,
    max: 1,
    formatter: percentage
  }
];
