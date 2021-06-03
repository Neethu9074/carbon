/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['gateway_status'],
    labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.labelGatewayStatus')],
    min: 0,
    max: 1,
    formatter: number
  },
  {
    metrics: ['gateway_bytes_in'],
    labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.gatewayBytesIn')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['gateway_bytes_out'],
    labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.gatewayBytesOut')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['gateway_packets_in'],
    labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.gatewayPacketsIn')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['gateway_packets_out'],
    labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.gatewayPacketsOut')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch(
      'vpn_connections',
      'connection_status',
      t('in-forge:plugins.ibmCloudVpn4Vpc.connection')
    ),
    label: t('in-forge:plugins.ibmCloudVpn4Vpc.labelConnectionStatus'),
    category: [t('in-forge:plugins.ibmCloudVpn4Vpc.connection')],
    min: 0,
    max: 1,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'vpn_connections',
      'connection_bytes_in',
      t('in-forge:plugins.ibmCloudVpn4Vpc.connection')
    ),
    label: t('in-forge:plugins.ibmCloudVpn4Vpc.bytesIn'),
    category: [t('in-forge:plugins.ibmCloudVpn4Vpc.connection')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch(
      'vpn_connections',
      'connection_bytes_out',
      t('in-forge:plugins.ibmCloudVpn4Vpc.connection')
    ),
    label: t('in-forge:plugins.ibmCloudVpn4Vpc.bytesOut'),
    category: [t('in-forge:plugins.ibmCloudVpn4Vpc.connection')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch(
      'vpn_connections',
      'connection_packets_in',
      t('in-forge:plugins.ibmCloudVpn4Vpc.connection')
    ),
    label: t('in-forge:plugins.ibmCloudVpn4Vpc.packetsIn'),
    category: [t('in-forge:plugins.ibmCloudVpn4Vpc.connection')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'vpn_connections',
      'connection_packets_out',
      t('in-forge:plugins.ibmCloudVpn4Vpc.connection')
    ),
    label: t('in-forge:plugins.ibmCloudVpn4Vpc.packetsOut'),
    category: [t('in-forge:plugins.ibmCloudVpn4Vpc.connection')],
    min: 0,
    formatter: number
  }
];
