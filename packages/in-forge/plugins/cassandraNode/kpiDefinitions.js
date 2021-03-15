/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { muSecondsToMillisZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
