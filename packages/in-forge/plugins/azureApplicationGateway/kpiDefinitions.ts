/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, meanLatency } from 'in-services/formatters/number';
import { t } from 'in-i18n';
export default [
  {
    label: t('in-forge:plugins.azureApplicationGateway.kpi.labelConnectionsCount'),
    metric: 'currentConnections',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.azureApplicationGateway.kpi.labelApplicationGatewayTime'),
    metric: 'applicationGatewayTotalTime',
    formatter: meanLatency.detailed
  }
];
