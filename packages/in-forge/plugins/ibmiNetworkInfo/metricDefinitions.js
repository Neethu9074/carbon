/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatInterfaceMetrics',
        'status',
        t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.status')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesOut',
        'bytesSentRemotely',
        t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesOutName')
      )
    ],
    labels: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesSentRemotely')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesOutName')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesOut',
        'bytesReceivedLocally',
        t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesOutName')
      )
    ],
    labels: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesReceivedLocally')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesOutName')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesIn',
        'bytesSentRemotely',
        t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesInName')
      )
    ],
    labels: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesSentRemotely')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesInName')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'netstatMetricsBytesIn',
        'bytesReceivedLocally',
        t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesInName')
      )
    ],
    labels: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesReceivedLocally')],
    min: 0,
    formatter: bytes.compact,
    category: [t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesInName')]
  }
];
