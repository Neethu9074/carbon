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
      'metrics.Availability.DATABASE_AVAILABILITY.minValue',
      'metrics.Availability.DATABASE_AVAILABILITY.maxValue',
      'metrics.Availability.DB2_Database_Status.DB6_DATABASE_STATUS.value',
      'metrics.Availability.DB2_Instance_Status.DB6_INSTANCE_STATUS.value',
      'metrics.Availability.DBA_Cockpit_Connection_Status.DB6_DBA_CONNECT_STATUS.value',
      'metrics.Exceptions.ADM1823E_Transaction_Log_Held_by_an_Open_Transaction.ADM1823E.value',
      'metrics.Exceptions.ADM1849C_LSN_Exhaustion.ADM1849C.value',
      'metrics.Exceptions.Corrupt_page.DIA8400C.value',
      'metrics.Exceptions.Corrupt_page.DIA8426C.value',
      'metrics.Exceptions.Disk_Error.SQL0980C.value',
      'metrics.Exceptions.File_System_Full.SQL0968C.value',
      'metrics.Exceptions.Maximum_Number_of_Objects_in_Tablespace.SQL0960C.value',
      'metrics.Exceptions.Transaction_Log_Full.SQL0964C.value'
    ],
    labels: [
      t('in-forge:plugins.sapDbms.minValue'),
      t('in-forge:plugins.sapDbms.maxValue'),
      t('in-forge:plugins.sapDbms.dBStatus'),
      t('in-forge:plugins.sapDbms.dBInstanceStatus'),
      t('in-forge:plugins.sapDbms.dBAConnectStatus'),
      t('in-forge:plugins.sapDbms.aDM1823E'),
      t('in-forge:plugins.sapDbms.aDM1849C'),
      t('in-forge:plugins.sapDbms.DIA8400C'),
      t('in-forge:plugins.sapDbms.DIA8426C'),
      t('in-forge:plugins.sapDbms.diskErrorSQL0980C'),
      t('in-forge:plugins.sapDbms.fileSystemFullSQL0968C'),
      t('in-forge:plugins.sapDbms.maxNoOfObjectsInTablespaceSQL0960C'),
      t('in-forge:plugins.sapDbms.transactionLogFullSQL0964C')
    ],
    min: 0,
    formatter: number.compact
  }
];
