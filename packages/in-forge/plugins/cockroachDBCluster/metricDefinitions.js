/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

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
    labels: [
      t('in-forge:plugins.cockroachDBCluster.labelLatency50P'),
      t('in-forge:plugins.cockroachDBCluster.labelLatency75P'),
      t('in-forge:plugins.cockroachDBCluster.labelLatency90P'),
      t('in-forge:plugins.cockroachDBCluster.labelLatency99P'),
      t('in-forge:plugins.cockroachDBCluster.labelLatencyMax')
    ],
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
      t('in-forge:plugins.cockroachDBCluster.labelSQLConnections'),
      t('in-forge:plugins.cockroachDBCluster.labelSQLSelectCount'),
      t('in-forge:plugins.cockroachDBCluster.labelSQLWriteCount'),
      t('in-forge:plugins.cockroachDBCluster.labelTotalRanges'),
      t('in-forge:plugins.cockroachDBCluster.labelUnderreplicatedRanges'),
      t('in-forge:plugins.cockroachDBCluster.labelUnavailableRanges')
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
    labels: [
      t('in-forge:plugins.cockroachDBCluster.labelDiskRead'),
      t('in-forge:plugins.cockroachDBCluster.labelDiskWrite'),
      t('in-forge:plugins.cockroachDBCluster.labelNetworkReceive'),
      t('in-forge:plugins.cockroachDBCluster.labelNetworkSend')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['sys.host.disk.iopsinprogress', 'sys.host.disk.read.count', 'sys.host.disk.write.count'],
    labels: [
      t('in-forge:plugins.cockroachDBCluster.labelDiskIops'),
      t('in-forge:plugins.cockroachDBCluster.labelDiskReadCount'),
      t('in-forge:plugins.cockroachDBCluster.labelDiskWriteCount')
    ],
    min: 0,
    formatter: number
  }
];
