/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { zeroDecimalPlaces, number, twoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['avgResTime', 'preCallTime', 'callTime', 'postCallTime', 'errors', 'rsfu', 'rqfu'],
    labels: [
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime'),
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.preCallTime'),
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.callTime'),
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.postCallTime'),
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.errors'),
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.rsfu'),
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.rqfu')
    ],
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput')],
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: twoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'avgResTime',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'throughput',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: twoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'preCallTime',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.preCallTime'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'callTime',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.callTime'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'postCallTime',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.postCallTime'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'errors',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.errors'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: twoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'rsfu',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.rsfu'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'svcBrokers',
      'rqfu',
      t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')
    ),
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.rqfu'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')],
    formatter: number
  }
];
