/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { bytesPerSecondTwoDecimalPlaces, kiloBytesTwoDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_avg',
    label: t('in-xenserver:dashboards.cpuAvg'),
    formatter: number.detailed
  },
  {
    metric: 'memory_free_kib',
    label: t('in-xenserver:dashboards.memoryFree'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'memory_total_kib',
    label: t('in-xenserver:dashboards.memoryTotal'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'pif_aggr_rx',
    label: t('in-xenserver:dashboards.bytesRx'),
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: 'pif_aggr_tx',
    label: t('in-xenserver:dashboards.bytesTx'),
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: 'xapi_memory_usage_kib',
    label: t('in-xenserver:dashboards.xapiMemoryUsage'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'xapi_free_memory_kib',
    label: t('in-xenserver:dashboards.xapiFreeMemory'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'xapi_live_memory_kib',
    label: t('in-xenserver:dashboards.xapiLiveMemory'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'xapi_allocation_kib',
    label: t('in-xenserver:dashboards.xapiAllocation'),
    formatter: kiloBytesTwoDecimalPlaces
  }
];
