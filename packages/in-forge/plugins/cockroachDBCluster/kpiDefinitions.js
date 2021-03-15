/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesZeroDecimalPlaces, timeByNanoTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.cockroachDBCluster.labelSQLLatency'),
    metric: 'sql.exec.latency-p99',
    formatter: timeByNanoTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.cockroachDBCluster.labelDiskReadBytes'),
    metric: 'sys.host.disk.read.bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
