/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, nanos } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'sql.exec.latency-p50',
      'sql.exec.latency-p75',
      'sql.exec.latency-p90',
      'sql.exec.latency-p99',
      'sql.exec.latency-max'
    ],
    labels: [
      t('in-forge:plugins.cockroachDBNode.labelLatency50P'),
      t('in-forge:plugins.cockroachDBNode.labelLatency75P'),
      t('in-forge:plugins.cockroachDBNode.labelLatency90P'),
      t('in-forge:plugins.cockroachDBNode.labelLatency99P'),
      t('in-forge:plugins.cockroachDBNode.labelLatencyMax')
    ],
    min: 0,
    formatter: nanos
  },
  {
    metrics: [
      'sql.conns',
      'sql.write.count',
      'ranges.count',
      'ranges.underreplicated.total',
      'ranges.unavailable.total'
    ],
    labels: [
      t('in-forge:plugins.cockroachDBNode.labelSQLConnections'),
      t('in-forge:plugins.cockroachDBNode.labelSQLWriteCount'),
      t('in-forge:plugins.cockroachDBNode.labelTotalRanges'),
      t('in-forge:plugins.cockroachDBNode.labelUnderreplicatedRanges'),
      t('in-forge:plugins.cockroachDBNode.labelUnavailableRanges')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sql.select.count', 'sql.update.count', 'sql.insert.count', 'sql.delete.count'],
    labels: [
      t('in-forge:plugins.cockroachDBNode.labelSelects'),
      t('in-forge:plugins.cockroachDBNode.labelUpdates'),
      t('in-forge:plugins.cockroachDBNode.labelInserts'),
      t('in-forge:plugins.cockroachDBNode.labelDeletes')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sys.go.allocbytes', 'sys.go.totalbytes', 'sys.cgo.allocbytes', 'sys.cgo.totalbytes'],
    labels: [
      t('in-forge:plugins.cockroachDBNode.labelGoMemoryAllocated'),
      t('in-forge:plugins.cockroachDBNode.labelGoMemoryTotal'),
      t('in-forge:plugins.cockroachDBNode.labelCGoMemoryAllocated'),
      t('in-forge:plugins.cockroachDBNode.labelCGoMemoryTotal')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      'sys.host.disk.read.bytes',
      'sys.host.disk.write.bytes',
      'sys.host.net.recv.bytes',
      'sys.host.net.send.bytes'
    ],
    labels: [
      t('in-forge:plugins.cockroachDBNode.labelDiskRead'),
      t('in-forge:plugins.cockroachDBNode.labelDiskWrite'),
      t('in-forge:plugins.cockroachDBNode.labelNetworkReceive'),
      t('in-forge:plugins.cockroachDBNode.labelNetworkSend')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['sys.host.disk.iopsinprogress', 'sys.host.disk.read.count', 'sys.host.disk.write.count'],
    labels: [
      t('in-forge:plugins.cockroachDBNode.labelDiskIops'),
      t('in-forge:plugins.cockroachDBNode.labelDiskReadCount'),
      t('in-forge:plugins.cockroachDBNode.labelDiskWriteCount')
    ],
    min: 0,
    formatter: number
  }
];
