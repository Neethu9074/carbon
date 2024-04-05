/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.cockroachDBNode.labelSQLLatency'),
    metric: 'sql.exec.latency-p99',
    formatter: timeByNanoTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.cockroachDBNode.labelSQLQueries'),
    metric: 'sql.query.count',
    formatter: zeroDecimalPlaces
  }
];
