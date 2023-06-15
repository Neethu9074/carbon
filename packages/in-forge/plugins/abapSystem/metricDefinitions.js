/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Availability.ABAP_System_Availability.ABAP_MESSAGE_SERVER_HTTP_AVAIL.value',
      'metrics.Availability.ABAP_System_Availability.ABAP_SYSTEM_AVAILABILITY.value',
      'metrics.Availability.ABAP_System_Availability.ABAP_SYSTEM_REMOTE_RFC_AVAILAB.value',
      'metrics.Availability.System_Availability.RECEIVING_STATUS_FROM_DATABASE.value',

      'metrics.Configuration.ABAP_Transports.ABAP_TRANSPORTS.value',
      'metrics.Configuration.NUMBER_OF_ABAP_TRANSPORTS.ABAP_TRANSPORTS.value',

      'metrics.Configuration.Expiring_ABAP_certificates.ABAP_SYS_EXPIRING_CERT_ALERT.value',

      'metrics.Configuration.Failed_ABAP_Transports.ABAP_SYS_FAILED_TRANSPORTS.value',
      'metrics.Configuration.Failed_ABAP_Transports.ABAP_SYS_FAILED_TRANSPORT_ALERT.value',

      'metrics.Configuration.Global_changes_allowed.ABAP_SYS_GLOBAL_CHANGE_ALERT.value',
      'metrics.Configuration.Global_changes_allowed.ABAP_SYS_GLOBAL_CHANGE_OPTION.value',

      'metrics.Configuration.ICF_Service_Changes.ICF_SERVICE_CHANGES.value',
      'metrics.Configuration.ICF_Service_Changes.NUMBER_OF_ICF_SERVICE_CHANGES.value',

      'metrics.Configuration.RFC_Destinations.NUMBER_OF_CHANGED_ABAP_RFC_DES.value',
      'metrics.Configuration.RFC_Destinations.RFC_DESTINATIONS.value',

      'metrics.Configuration.SAP_Notes.NUMBER_OF_INSTALLED_SAP_NOTES.value',
      'metrics.Configuration.SAP_Notes.SAP_NOTES.value',

      'metrics.Configuration.System_Configuration.SYSTEM_CONFIGURATION.value',

      'metrics.Configuration.Users_with_critical_profiles.ABAP_SYS_AUTH_PROFILE_ALERT.value',
      'metrics.Configuration.Users_with_critical_profiles.ABAP_SYS_AUTH_PROFILE_USERS_PER_CLIENT.value',
      'metrics.Configuration.Users_with_critical_profiles.ABAP_SYS_EXPIRING_CERTIFICATES_PER_INSTANCE.value',

      'metrics.Exceptions.Batch_Jobs.ABAP_SYSTEM_BATCH_JOBS_RUNNING.value',
      'metrics.Exceptions.Batch_Jobs.ABAP_SYS_BATCHJOBS_CANCEL_1H.value',

      'metrics.Exceptions.Enqueue_Processing.ABAP_SYS_ENQUEUE_OLDER_1HOUR.value',
      'metrics.Exceptions.Enqueue_Processing.ABAP_SYS_ENQUEUE_TOTAL.value',

      'metrics.Exceptions.IDoc.ABAP_IDOCS_IN_RED_STATE_15MIN.value',
      'metrics.Exceptions.IDoc.ABAP_IDOCS_IN_YELLOW_STATE_15MIN.value',
      'metrics.Exceptions.IDoc.ABAP_IDOC_ERRORS.value',

      'metrics.Exceptions.Number_of_Errors_in_the_Gateway_Error_Log.GW_ERR_LOG_5MIN.value',
      'metrics.Exceptions.Number_of_Errors_in_the_Gateway_Error_Log.GW_LOGS.value',

      'metrics.Exceptions.Number_of_Push_notification_queues_in_error_status.GW_PUSH.value',

      'metrics.Exceptions.Spool.ABAP_SYS_SPOOL_ERROR.value',

      'metrics.Exceptions.Update_Processing.ABAP_SYS_UPDATE_STATUS.value',

      'metrics.Exceptions.bgRFC.ABAP_SYSTEM_BGRFC_QUEUE_NUMBER.value',

      'metrics.Exceptions.qRFC.ABAP_SYSTEM_QRFC_IN_EVENT.value',
      'metrics.Exceptions.qRFC.ABAP_SYSTEM_QRFC_OUT_EVENT.value',
      'metrics.Exceptions.qRFC.ABAP_SYS_QRFC_IN_QUEUES_ERRORSTATE.value',
      'metrics.Exceptions.qRFC.ABAP_SYS_QRFC_IN_QUEUE_NUMBER.value',
      'metrics.Exceptions.qRFC.ABAP_SYS_QRFC_OUT_QUEUES_ERRORSTATE.value',
      'metrics.Exceptions.qRFC.ABAP_SYS_QRFC_OUT_QUEUE_NUMBER.value',
      'metrics.Exceptions.qRFC.QRFC.value',

      'metrics.Exceptions.tRFC.ABAP_SYSTEM_TRFC.value',
      'metrics.Exceptions.tRFC.ABAP_SYSTEM_TRFC_CPICERR.value',
      'metrics.Exceptions.tRFC.ABAP_SYSTEM_TRFC_SYSFAIL.value',

      'metrics.Performance.Average_payload_size_sent_per_service_call.GW_AVG_PAYLOAD_Average_payload_size_sent_per_service_call.value',
      'metrics.Performance.Performance_of_Gateway_Service_Requests.GW_AVG_RESPTI_Average_Response_Time_of_Gateway_Services_last_5_minutes.value',
      'metrics.Performance.Performance_of_Gateway_Service_Requests.GW_SERVICE_PERFORMANCE.value',

      'metrics.Performance.User_Load.ABAP_SYST_DIALOG_USERS.value',
      'metrics.Performance.User_Load.ABAP_SYST_HTTP_USERS.value',
      'metrics.Performance.User_Load.ABAP_SYST_RFC_USERS.value',
      'metrics.Performance.User_Load.ABAP_SYST_TOTAL_USERS.value',
      'metrics.Performance.User_Load.ABAP_SYS_CONCURRENT_USERS.value',
      'metrics.Performance.User_Load.ABAP_SYS_USERS_PER_APPSERVER.value',
      'metrics.Performance.User_Load.USER_LOAD.value'
    ],
    labels: [
      t('in-forge:plugins.abapSystem.value'),
      t('in-forge:plugins.abapSystem.abapSystemAvailability'),
      t('in-forge:plugins.abapSystem.abapRemoteSystemRFCAvailability'),
      t('in-forge:plugins.abapSystem.receivingStatusFromDatabase'),

      t('in-forge:plugins.abapSystem.abapTransports'),
      t('in-forge:plugins.abapSystem.noOfAbapTransports'),

      t('in-forge:plugins.abapSystem.abapSystemExpiringCertAlert'),
      t('in-forge:plugins.abapSystem.abapSystemFailedTransports'),
      t('in-forge:plugins.abapSystem.abapSystemFailedTransportsAlert'),

      t('in-forge:plugins.abapSystem.abapSystemGlobalChangeAlert'),
      t('in-forge:plugins.abapSystem.abapSystemGlobalChangeOption'),

      t('in-forge:plugins.abapSystem.iCFServiceChanges'),
      t('in-forge:plugins.abapSystem.noOfICFServiceChanges'),

      t('in-forge:plugins.abapSystem.noOfChangedRFCDestinations'),
      t('in-forge:plugins.abapSystem.rFCDestinations'),

      t('in-forge:plugins.abapSystem.noOfSAPNotesInstalled'),
      t('in-forge:plugins.abapSystem.sAPNotes'),

      t('in-forge:plugins.abapSystem.systemConfiguration'),

      t('in-forge:plugins.abapSystem.authProfileAlert'),
      t('in-forge:plugins.abapSystem.authProfilePerClient'),
      t('in-forge:plugins.abapSystem.expiringCertificate'),

      t('in-forge:plugins.abapSystem.batchJobsRunning'),
      t('in-forge:plugins.abapSystem.batchJobsCancelled'),

      t('in-forge:plugins.abapSystem.enqueueOlder1Hour'),
      t('in-forge:plugins.abapSystem.enqueueTotal'),

      t('in-forge:plugins.abapSystem.iDOCSInRedState'),
      t('in-forge:plugins.abapSystem.iDOCSInYellowState'),
      t('in-forge:plugins.abapSystem.iDOCSErrors'),

      t('in-forge:plugins.abapSystem.gWErrorLogs'),
      t('in-forge:plugins.abapSystem.gWLogs'),

      t('in-forge:plugins.abapSystem.gWPush'),

      t('in-forge:plugins.abapSystem.spoolError'),

      t('in-forge:plugins.abapSystem.updateStatus'),
      t('in-forge:plugins.abapSystem.bGRFCQueueNo'),

      t('in-forge:plugins.abapSystem.qGRFCInEvent'),
      t('in-forge:plugins.abapSystem.qGRFCOutEvent'),
      t('in-forge:plugins.abapSystem.qGRFCErrorState'),
      t('in-forge:plugins.abapSystem.qGRFCInNo'),
      t('in-forge:plugins.abapSystem.qGRFCOutQueueError'),
      t('in-forge:plugins.abapSystem.qGRFCOutQueueNo'),
      t('in-forge:plugins.abapSystem.qGRFC'),

      t('in-forge:plugins.abapSystem.tRFC'),
      t('in-forge:plugins.abapSystem.tRFCcpic'),
      t('in-forge:plugins.abapSystem.tRFCSysFail'),

      t('in-forge:plugins.abapSystem.gWAVGPayloadSize'),

      t('in-forge:plugins.abapSystem.gWResponseTime'),
      t('in-forge:plugins.abapSystem.gWServicePerformance'),

      t('in-forge:plugins.abapSystem.dialogUsers'),
      t('in-forge:plugins.abapSystem.httpUsers'),
      t('in-forge:plugins.abapSystem.rFCUsers'),
      t('in-forge:plugins.abapSystem.totalUsers'),
      t('in-forge:plugins.abapSystem.concurrentUsers'),
      t('in-forge:plugins.abapSystem.userPerAppServer'),
      t('in-forge:plugins.abapSystem.userLoad')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      'metrics.Exceptions.Enqueue_Processing.ABAP_SYS_ENQUEUE_GRANULE_UTIL.value',
      'metrics.Exceptions.Spool.ABAP_SYS_USED_SPOOL_NUMBER_RANGE.value'
    ],
    labels: [t('in-forge:plugins.abapSystem.enqueueGranule'), t('in-forge:plugins.abapSystem.spoolNumberRange')],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'metrics.Exceptions.ABAP_Short_Dumps',
        'value',
        t('in-forge:plugins.abapSystem.abapShortDumps')
      )
    ],
    labels: [t('in-forge:plugins.abapSystem.abapShortDumps')],
    min: 0,
    formatter: number.compact
  }
];
