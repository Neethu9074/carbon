/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

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
