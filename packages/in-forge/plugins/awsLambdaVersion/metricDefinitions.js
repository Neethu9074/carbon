/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['invocations', 'errors', 'dead_letter_error'],
    labels: [
      t('in-forge:plugins.awsLambda.titleInvocations'),
      t('in-forge:plugins.awsLambda.titleErrors'),
      t('in-forge:plugins.awsLambda.titleDeadLetterErrors')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['duration', 'duration_maximum', 'duration_minimum', 'duration_sum'],
    labels: [
      t('in-forge:plugins.awsLambda.labelDurationAverage'),
      t('in-forge:plugins.awsLambda.labelDurationMaximum'),
      t('in-forge:plugins.awsLambda.labelDurationMinimum'),
      t('in-forge:plugins.awsLambda.labelDurationSum')
    ],
    min: 0,
    formatter: millis.compact
  },
  {
    metrics: [
      'throttles',
      'concurrent_executions',
      'concurrent_executions_maximum',
      'concurrent_executions_minimum',
      'concurrent_executions_sum',
      'unreserved_concurrent_executions'
    ],
    labels: [
      t('in-forge:plugins.awsLambda.titleThrottles'),
      t('in-forge:plugins.awsLambda.labelConcurrentExecutionsAverage'),
      t('in-forge:plugins.awsLambda.labelConcurrentExecutionsMaximum'),
      t('in-forge:plugins.awsLambda.labelConcurrentExecutionsMinimum'),
      t('in-forge:plugins.awsLambda.labelConcurrentExecutionsSum'),
      t('in-forge:plugins.awsLambda.titleUnreservedConcurrentExecutions')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['iterator_age', 'iterator_age_minimum', 'iterator_age_maximum', 'iterator_age_sum'],
    labels: [
      t('in-forge:plugins.awsLambda.labelIteratorAgeAverage'),
      t('in-forge:plugins.awsLambda.labelIteratorAgeMinimum'),
      t('in-forge:plugins.awsLambda.labelIteratorAgeMaximum'),
      t('in-forge:plugins.awsLambda.labelIteratorAgeSum')
    ],
    min: 0,
    formatter: millis.compact
  }
];
