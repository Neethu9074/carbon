/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, nanos } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'sql.exec.latency-p50',
      'sql.exec.latency-p75',
      'sql.exec.latency-p90',
      'sql.exec.latency-p99',
      'sql.exec.latency-max'
    ],
    labels: ['Latency 50th', 'Latency 75th', 'Latency 90th', 'Latency 99th', 'Latency Max'],
    min: 0,
    formatter: nanos
  },
  {
    metrics: [
      'sql.conns',
      'sql.select.count',
      'sql.write.count',
      'ranges.count',
      'ranges.underreplicated.total',
      'ranges.unavailable.total'
    ],
    labels: [
      'SQL Connections',
      'SQL Select Count',
      'SQL Write Count',
      'Total Ranges',
      'Underreplicated Ranges',
      'Unavailable Ranges'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'sys.host.disk.read.bytes',
      'sys.host.disk.write.bytes',
      'sys.host.net.recv.bytes',
      'sys.host.net.send.bytes'
    ],
    labels: ['Disk read', 'Disk write', 'Network receive', 'Network send'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['sys.host.disk.iopsinprogress', 'sys.host.disk.read.count', 'sys.host.disk.write.count'],
    labels: ['Disk Iops', 'Disk read count', 'Disk write count'],
    min: 0,
    formatter: number
  }
];
