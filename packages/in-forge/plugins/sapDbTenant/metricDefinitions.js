/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Availability.HDB_Service_Availability_Inst_Via_DA.HDB_SERVICE_AVAILABILITY_INST_VIA_DA.value',
      'metrics.Availability.DB_Instance_Status.HDB_HOST_STATUS_METRIC_INST.value',
      'metrics.Exceptions.Failed_IO_Reads.HDB_FAILED_IO_READS_INST.value',
      'metrics.Exceptions.Failed_IO_Writes.HDB_FAILED_IO_WRITES_INST.value',
      'metrics.Performance.Log_Switch_Race_Count_Ratio.HDB_LOG_RACE_RATIO_INST.value',
      'metrics.Performance.Log_Switch_Wait_Count_Ratio.HDB_LOG_SWITCH_RATIO_INST.value'
    ],
    labels: [
      t('in-forge:plugins.sapDbTenant.serviceAvailability'),
      t('in-forge:plugins.sapDbTenant.dbInstanceStatus'),
      t('in-forge:plugins.sapDbTenant.failedIOReads'),
      t('in-forge:plugins.sapDbTenant.failedIOWrites'),
      t('in-forge:plugins.sapDbTenant.logRaceRatio'),
      t('in-forge:plugins.sapDbTenant.logSwitchRatio')
    ],
    min: 0,
    formatter: number.compact
  }
];
