/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { muSecondsToMillisZeroDecimalPlaces, number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.cassandraNode.labelClientReadRequests'),
    metric: 'clientrequests.read.count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.cassandraNode.labelMeanReadRequests'),
    metric: 'clientrequests.read.mean',
    formatter: muSecondsToMillisZeroDecimalPlaces
  }
];
