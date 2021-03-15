/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsLambda.titleInvocations'),
    metric: 'invocations',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsLambda.labelDurationAverage'),
    metric: 'duration',
    formatter: millis.compact
  }
];
