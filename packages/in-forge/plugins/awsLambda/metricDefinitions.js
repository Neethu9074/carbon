/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'invocations',
    label: t('in-forge:plugins.awsLambda.titleInvocations'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'errors',
    label: t('in-forge:plugins.awsLambda.titleErrors'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'dead_letter_error',
    label: t('in-forge:plugins.awsLambda.titleDeadLetterErrors'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'duration',
    label: t('in-forge:plugins.awsLambda.labelDurationAverage'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'duration_maximum',
    label: t('in-forge:plugins.awsLambda.labelDurationMaximum'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'duration_minimum',
    label: t('in-forge:plugins.awsLambda.labelDurationMinimum'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'duration_sum',
    label: t('in-forge:plugins.awsLambda.labelDurationSum'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'throttles',
    label: t('in-forge:plugins.awsLambda.titleThrottles'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'iterator_age',
    label: t('in-forge:plugins.awsLambda.labelIteratorAgeAverage'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'iterator_age_minimum',
    label: t('in-forge:plugins.awsLambda.labelIteratorAgeMinimum'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'iterator_age_maximum',
    label: t('in-forge:plugins.awsLambda.labelIteratorAgeMaximum'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'iterator_age_sum',
    label: t('in-forge:plugins.awsLambda.labelIteratorAgeSum'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'concurrent_executions',
    label: t('in-forge:plugins.awsLambda.labelConcurrentExecutionsAverage'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'concurrent_executions_maximum',
    label: t('in-forge:plugins.awsLambda.labelConcurrentExecutionsMaximum'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'concurrent_executions_minimum',
    label: t('in-forge:plugins.awsLambda.labelConcurrentExecutionsMinimum'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'concurrent_executions_sum',
    label: t('in-forge:plugins.awsLambda.labelConcurrentExecutionsSum'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'unreserved_concurrent_executions',
    label: t('in-forge:plugins.awsLambda.titleUnreservedConcurrentExecutions'),
    min: 0,
    formatter: number.compact
  }
];
