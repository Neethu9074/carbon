/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['totalApiCalls', 'totalError'],
    labels: [t('in-forge:plugins.ibmApiConnect.totalApiCalls'), t('in-forge:plugins.ibmApiConnect.totalErrors')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['maxResponseTime', 'minResponseTime', 'avgResponseTime'],
    labels: [
      t('in-forge:plugins.ibmApiConnect.maxApiResponse'),
      t('in-forge:plugins.ibmApiConnect.minApiResponse'),
      t('in-forge:plugins.ibmApiConnect.avgApiResponse')
    ],
    min: 0,
    formatter: millis.compact
  },
  {
    metrics: ['status2xx', 'status4xx', 'status5xx'],
    labels: [
      t('in-forge:plugins.ibmApiConnectCatalog.2xxStatusCount'),
      t('in-forge:plugins.ibmApiConnectCatalog.4xxStatusCount'),
      t('in-forge:plugins.ibmApiConnectCatalog.5xxStatusCount')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['avgStatus2xx', 'avgStatus4xx', 'avgStatus5xx'],
    labels: [
      t('in-forge:plugins.ibmApiConnectCatalog.2xxStatusAvg'),
      t('in-forge:plugins.ibmApiConnectCatalog.4xxStatusAvg'),
      t('in-forge:plugins.ibmApiConnectCatalog.5xxStatusAvg')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalApiCallSuccess', 'maxResponseTimeSuccess', 'minResponseTimeSuccess', 'avgResponseTimeSuccess'],
    labels: [
      t('in-forge:plugins.ibmApiConnectCatalog.timeToServeSuccess'),
      t('in-forge:plugins.ibmApiConnectCatalog.maxResponseSuccess'),
      t('in-forge:plugins.ibmApiConnectCatalog.minResponseSuccess'),
      t('in-forge:plugins.ibmApiConnectCatalog.avgResponseSuccess')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalApiCallError', 'maxResponseTimeError', 'minResponseTimeError', 'avgResponseTimeError'],
    labels: [
      t('in-forge:plugins.ibmApiConnectCatalog.timeToServeFailure'),
      t('in-forge:plugins.ibmApiConnectCatalog.maxResponseFailure'),
      t('in-forge:plugins.ibmApiConnectCatalog.minResponseFailure'),
      t('in-forge:plugins.ibmApiConnectCatalog.avgResponseFailure')
    ],
    min: 0,
    formatter: number
  }
];
