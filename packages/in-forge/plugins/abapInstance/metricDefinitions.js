/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, millis, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Availability.ABAP_Central_Service_Availability.ABAP_SCS_MESSAGE_SERVER_STATUS.value',
      'metrics.Availability.ABAP_Central_Service_Availability.ABAP_SCS_ENQUEUE_SERVER_STATUS.value',

      'metrics.Availability.ABAP_Instance_Availability.ABAP_INSTANCE_LOCAL_HTTP_AVAIL_Instance_Local_Http_Availability.value',
      'metrics.Availability.ABAP_Instance_Availability.ABAP_SCS_MESSAGE_SERVER.value',

      'metrics.Availability.High_number_of_ABAP_System_Log_Messages.RECEIVING_STATUS_FROM_HOST.value',

      'metrics.Availability.Instance_Availability.ABAP_INSTANCE_AVAILABILITY.value',
      'metrics.Availability.Instance_Availability.ABAP_INSTANCE_STATUS.value',
      'metrics.Availability.Instance_Availability.ABAP_LOCAL_RFC_AVAILABILITY.value',

      'metrics.Exceptions.ABAP_Short_Dumps.ABAP_INST_SHORTDUMPS_ABAP_Short_Dumps.value',
      'metrics.Exceptions.ABAP_Short_Dumps.ABAP_SHORTDUMP_FREQ.value',

      'metrics.Exceptions.High_number_of_ABAP_System_Log_Messages.RECEIVING_STATUS_FROM_HOST.value',
      'metrics.Exceptions.High_number_of_ABAP_system_log_messages.ABAP_SYSTEM_LOG.value',

      'metrics.Performance.ABAP_User_Load.ABAP_INST_DIALOG_CLIENT_USERS.value',
      'metrics.Performance.ABAP_User_Load.ABAP_INST_DIALOG_CLIENT_USERS_Number_of_Dialog_Users_in_Client.value',
      'metrics.Performance.ABAP_User_Load.ABAP_INST_DIALOG_USERS.value',
      'metrics.Performance.ABAP_User_Load.ABAP_INST_HTTP_USERS.value',
      'metrics.Performance.ABAP_User_Load.ABAP_INST_RFC_USERS.value',
      'metrics.Performance.ABAP_User_Load.ABAP_INST_TOTAL_USERS.value',
      'metrics.Performance.ABAP_User_Load.HIGH_USER_LOAD.value',

      'metrics.Performance.Batch_Resources.ABAP_INST_BTC_QUEUE_LENGTH.value',
      'metrics.Performance.Batch_Resources.ABAP_INST_BTC_WP_FREE.value',
      'metrics.Performance.Batch_Resources.ABAP_INST_BTC_WP_STOPPED.value',

      'metrics.Performance.Dialog_Resources.ABAP_INST_DIALOG_LONGRUNNING.value',
      'metrics.Performance.Dialog_Resources.DIALOG_RESOURCES.value',

      'metrics.Performance.Dialog_Response_Time.NUMBER_OF_DIALOG_STEPS_PER_MIN.value',

      'metrics.Performance.Gateway_Resources.GATEWAY_RESOURCES.value',

      'metrics.Performance.High_number_of_ABAP_System_Log_Messages.RECEIVING_STATUS_FROM_HOST.value',

      'metrics.Performance.ICM_Resources.ICM_RESOURCES.value',
      'metrics.Performance.ICM_Resources.NUMBER_OF_ICM_CONNECTIONS.value',
      'metrics.Performance.ICM_Resources.NUMBER_OF_ICM_REQUESTS_IN_QUEU.value',
      'metrics.Performance.ICM_Resources.NUMBER_OF_ICM_THREADS.value',

      'metrics.Performance.Memory.MEMORY.value',
      'metrics.Performance.Memory.NUMBER_OF_BUFFER_SWAPS_Buffer_name_eq_CUA_db_Key_Figure_eq_Swaps.value',
      'metrics.Performance.Memory.NUMBER_OF_BUFFER_SWAPS_Buffer_name_eq_Nametab_Field_definition_db_Key_Figure_eq_Swaps.value',
      'metrics.Performance.Memory.NUMBER_OF_BUFFER_SWAPS_Buffer_name_eq_Nametab_Short_db_Key_Figure_eq_Swaps.value',
      'metrics.Performance.Memory.NUMBER_OF_BUFFER_SWAPS_Buffer_name_eq_Program_db_Key_Figure_eq_Swaps.value',
      'metrics.Performance.Memory.NUMBER_OF_BUFFER_SWAPS_Buffer_name_eq_Table_Generic_key_db_Key_Figure_eq_Swaps.value',
      'metrics.Performance.Memory.NUMBER_OF_BUFFER_SWAPS_Buffer_name_eq_Table_Single_record_db_Key_Figure_eq_Swaps.value',
      'metrics.Performance.Memory.NUMBER_OF_BUFFER_SWAPS_Number_of_buffer_swaps.value',

      'metrics.Performance.Spool_Resources.SPOOL_RESOURCES.value',
      'metrics.Performance.Spool_Resources.SPOOL_WORK_PROCESSES_STOPPED.value',

      'metrics.Performance.Update_Resources.UPDATE1_WORK_PROCESSES_STOPPED.value',
      'metrics.Performance.Update_Resources.UPDATE2_WORK_PROCESSES_STOPPED.value',
      'metrics.Performance.Update_Resources.UPDATE_RESSOURCES.value',

      'metrics.http.ABAP_INSTANCE_LOCAL_HTTP_AVAIL.value'
    ],
    labels: [
      t('in-forge:plugins.abapInstance.scsMessageServerStatus'),
      t('in-forge:plugins.abapInstance.scsEnqueueServerStatus'),

      t('in-forge:plugins.abapInstance.localHttpAvailability'),
      t('in-forge:plugins.abapInstance.scsMessageServerAvail'),

      t('in-forge:plugins.abapInstance.receiveStatus'),

      t('in-forge:plugins.abapInstance.instanceAvailability'),
      t('in-forge:plugins.abapInstance.instanceStatus'),
      t('in-forge:plugins.abapInstance.localRFC'),

      t('in-forge:plugins.abapInstance.abapShortDumps'),
      t('in-forge:plugins.abapInstance.abapShortDumpsFreq'),

      t('in-forge:plugins.abapInstance.recieveStatusFromHost'),
      t('in-forge:plugins.abapInstance.systemLog'),

      t('in-forge:plugins.abapInstance.dialogClientUsers'),
      t('in-forge:plugins.abapInstance.noDialogUsersClient'),
      t('in-forge:plugins.abapInstance.instDialogUsers'),
      t('in-forge:plugins.abapInstance.intHttpUsers'),
      t('in-forge:plugins.abapInstance.intRFCUsers'),
      t('in-forge:plugins.abapInstance.intTotalUsers'),
      t('in-forge:plugins.abapInstance.highUserLoad'),

      t('in-forge:plugins.abapInstance.instBTCQueueLength'),
      t('in-forge:plugins.abapInstance.instBTCWPFree'),
      t('in-forge:plugins.abapInstance.instBTCWPStopped'),

      t('in-forge:plugins.abapInstance.instDialogLongRunning'),
      t('in-forge:plugins.abapInstance.dialogResources'),

      t('in-forge:plugins.abapInstance.noOfdialogStepsPerMin'),

      t('in-forge:plugins.abapInstance.gatewayResources'),

      t('in-forge:plugins.abapInstance.statusFromHost'),

      t('in-forge:plugins.abapInstance.iCMResources'),
      t('in-forge:plugins.abapInstance.noICMConnections'),
      t('in-forge:plugins.abapInstance.noICMReq'),
      t('in-forge:plugins.abapInstance.noICMThreads'),

      t('in-forge:plugins.abapInstance.memory'),
      t('in-forge:plugins.abapInstance.memoryCUADb'),
      t('in-forge:plugins.abapInstance.memoryNametab'),
      t('in-forge:plugins.abapInstance.memoryNametabShort'),
      t('in-forge:plugins.abapInstance.memoryProgramDb'),
      t('in-forge:plugins.abapInstance.memoryTableGeneric'),
      t('in-forge:plugins.abapInstance.memoryTableSingle'),
      t('in-forge:plugins.abapInstance.memoryNoOfBufferSwaps'),

      t('in-forge:plugins.abapInstance.spoolResources'),
      t('in-forge:plugins.abapInstance.wPStopped'),

      t('in-forge:plugins.abapInstance.update1WPStopped'),
      t('in-forge:plugins.abapInstance.update2WPStopped'),
      t('in-forge:plugins.abapInstance.updateResources'),

      t('in-forge:plugins.abapInstance.localInstanceHttpAvailability')
    ],
    min: 0,
    formatter: number.compact
  },

  {
    metrics: [
      'metrics.Exceptions.High_number_of_ABAP_System_Log_Messages.FREQUENCY_OF_SYSTEM_LOG_MESSAG.value',
      'metrics.Performance.Dialog_Response_Time.DIALOG_DB_REQUEST_TIME.value',
      'metrics.Performance.Dialog_Response_Time.DIALOG_FRONTEND_NETWORK_TIME.value',
      'metrics.Performance.Dialog_Response_Time.DIALOG_FRONTEND_RESPONSE_TIME.value',
      'metrics.Performance.Dialog_Response_Time.DIALOG_LOAD_+_GENERATION_TIME.value',
      'metrics.Performance.Dialog_Response_Time.DIALOG_STANDARDIZED_RESPONSE_T.value'
    ],
    labels: [
      t('in-forge:plugins.abapInstance.frequencySystemLogMessage'),
      t('in-forge:plugins.abapInstance.dialogDBReqTime'),
      t('in-forge:plugins.abapInstance.dialogNetworkTime'),
      t('in-forge:plugins.abapInstance.dialogRespTime'),
      t('in-forge:plugins.abapInstance.dialogLoadGenTime'),
      t('in-forge:plugins.abapInstance.dialogStandardRespTime')
    ],
    min: 0,
    formatter: millis
  },

  {
    metrics: [
      'metrics.Performance.Dialog_Resources.ABAP_DIALOG_WORK_PROCESSES_IN.value',
      'metrics.Performance.Dialog_Resources.ABAP_DISP_WAIT_QUEUE_UTILIZATION.value',
      'metrics.Performance.Dialog_Resources.ABAP_INST_DIA_WP_USED.value',

      'metrics.Performance.ICM_Resources.ABAP_INST_ICM_CONN_USAGE.value',
      'metrics.Performance.ICM_Resources.ABAP_INST_ICM_REQUEST_USAGE.value',
      'metrics.Performance.ICM_Resources.ABAP_INST_ICM_THREAD_USAGE.value',

      'metrics.Performance.Memory.ABAP_INST_MEMORY_EM_USED.value',
      'metrics.Performance.Memory.ABAP_INST_MEMORY_HEAP_USED.value',
      'metrics.Performance.Memory.ABAP_INST_MEMORY_PAGING_AREA_USED.value',
      'metrics.Performance.Memory.ABAP_INST_MEMORY_ROLL_AREA_USED.value',

      'metrics.Performance.Spool_Resources.ABAP_INST_SPOOL_WP_UTILIZATION.value'
    ],
    labels: [
      t('in-forge:plugins.abapInstance.dialogWorkProcesses'),
      t('in-forge:plugins.abapInstance.dispatcherWaitQueue'),
      t('in-forge:plugins.abapInstance.dialogWorkProcessUsed'),

      t('in-forge:plugins.abapInstance.iCMConnectionUsage'),
      t('in-forge:plugins.abapInstance.iCMReqUsage'),
      t('in-forge:plugins.abapInstance.iCMThreadUsage'),

      t('in-forge:plugins.abapInstance.memoryUsed'),
      t('in-forge:plugins.abapInstance.memoryHeapUsed'),
      t('in-forge:plugins.abapInstance.memoryPagingUsed'),
      t('in-forge:plugins.abapInstance.memoryRollUsed'),

      t('in-forge:plugins.abapInstance.spoolUtil')
    ],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'metrics.Performance.ABAP_User_Load',
        'value',
        t('in-forge:plugins.abapInstance.abapClienteq')
      )
    ],
    labels: [t('in-forge:plugins.abapInstance.abapClienteq')],
    min: 0,
    formatter: number.compact
  },

  {
    metrics: [
      getDynamicMetricMatch(
        'metrics.Performance.Gateway_Resources',
        'value',
        t('in-forge:plugins.abapInstance.gatewayResourceUsage')
      ),
      getDynamicMetricMatch(
        'metrics.Performance.Update_Resources',
        'value',
        t('in-forge:plugins.abapInstance.updateQueueUtilization')
      )
    ],
    labels: [
      t('in-forge:plugins.abapInstance.gatewayResourceUsage'),
      t('in-forge:plugins.abapInstance.updateQueueUtilization')
    ],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  }
];
