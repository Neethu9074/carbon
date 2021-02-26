/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { millis, number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsLambda.titleInvocations'),
    metric: 'invocations',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsLambda.labelDurationAverage'),
    metric: 'duration',
    formatters: millis.compact
  }
];
