/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'numOfSBrokerProjects',
      'numOfTuxSvcs',
      'ts_avgResTime',
      'ts_throughput',
      'sbp_avgResTime',
      'sbp_preCallTime',
      'sbp_callTime',
      'sbp_postCallTime',
      'sbp_throughput',
      'sbp_errors'
    ],
    labels: [
      t('in-forge:plugins.tuxedoAppApplication.numOfSBrokerProjects'),
      t('in-forge:plugins.tuxedoAppApplication.numOfTuxSvcs'),
      t('in-forge:plugins.tuxedoAppApplication.ts_avgResTime'),
      t('in-forge:plugins.tuxedoAppApplication.ts_throughput'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_avgResTime'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_preCallTime'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_callTime'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_postCallTime'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_throughput'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_errors')
    ],
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppApplication.tuxedoAppApplication')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['ts_throughput', 'sbp_throughput', 'sbp_errors'],
    labels: [
      t('in-forge:plugins.tuxedoAppApplication.ts_throughput'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_throughput'),
      t('in-forge:plugins.tuxedoAppApplication.sbp_errors')
    ],
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppApplication.tuxedoAppApplication')],
    formatter: twoDecimalPlaces
  }
];
