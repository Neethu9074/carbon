/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { zeroDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['numQueued', 'numCompleted', 'stateMetric'],
    labels: [
      t('in-forge:plugins.tuxedoServer.numQueued'),
      t('in-forge:plugins.tuxedoServer.numCompleted'),
      t('in-forge:plugins.tuxedoServer.stateMetric')
    ],
    min: 0,
    category: [t('in-forge:plugins.tuxedoServer.servers')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('services', 'numQueued', t('in-forge:plugins.tuxedoServer.service')),
    label: t('in-forge:plugins.tuxedoServer.numQueuedEachServ'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoServer.services')],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('services', 'numCompleted', t('in-forge:plugins.tuxedoServer.service')),
    label: t('in-forge:plugins.tuxedoServer.numCompletedEachServ'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoServer.services')],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('services', 'stateMetric', t('in-forge:plugins.tuxedoServer.service')),
    label: t('in-forge:plugins.tuxedoServer.stateMetric'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoServer.services')],
    formatter: number.compact
  }
];
