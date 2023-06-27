/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, percentagePlainZeroDecimalPlaces, millis } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Availability.ADS_Instance_Http_Availability.ADS_AVAIL_HTTPPING.value',
      'metrics.Availability.Java_ICM_Status.JAVA_ICM_STATUS.value',

      'metrics.Availability.Java_Instance_Availability.HTTP_SERVICE_STATUS_(GRMG).value',
      'metrics.Availability.Java_Instance_Availability.JCO_STATUS_(GRMG).value',
      'metrics.Availability.Java_Instance_Availability.P4_SERVICE_STATUS_(GRMG).value',
      'metrics.Availability.Java_Instance_Availability.SERVLET_ENGINE_STATUS_(GRMG).value',
      'metrics.Availability.Java_Instance_Availability.WEB_SERVICES_STATUS_(GRMG).value',

      'metrics.Availability.Java_Server_Node_Status.JAVA_SERVER_NODE_STATUS_Java_Server_Node_Status.value',
      'metrics.Availability.Java_Server_Node_Status.JAVA_SERVER_NODE_STATUS_Process_Name_eq_server(.*).value',

      'metrics.Availability.Java_Enqueue_Server_Status.JAVA_SCS_ENQUEUE_STATUS.value',
      'metrics.Availability.Java_Enqueue_Server_Status.JAVA_SCS_MESSAGE_SERVER_STATUS.value'
    ],
    labels: [
      t('in-forge:plugins.sapJavaInstance.httpAvailability'),
      t('in-forge:plugins.sapJavaInstance.iCMStatus'),
      t('in-forge:plugins.sapJavaInstance.gRMGServiceStatus'),
      t('in-forge:plugins.sapJavaInstance.jCOStatus'),
      t('in-forge:plugins.sapJavaInstance.p4ServiceStatus'),
      t('in-forge:plugins.sapJavaInstance.servletEngineStatus'),
      t('in-forge:plugins.sapJavaInstance.webServicesStatus'),

      t('in-forge:plugins.sapJavaInstance.javaNodeServerStatus'),
      t('in-forge:plugins.sapJavaInstance.processNameEqServerStatus'),

      t('in-forge:plugins.sapJavaInstance.sCSEnqueueStatus'),
      t('in-forge:plugins.sapJavaInstance.sCSMessageServerStatus')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['metrics.Performance.Application_Threads.APPLICATION_THREADS_USAGE_Application_Threads_Usage.value'],
    labels: [t('in-forge:plugins.sapJavaInstance.threadUsage')],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: [
      'metrics.Performance.DB_Average_Response_Time.J2EE_DB_RESPONSE_TIME_DB_Average_Response_Time.value',
      'metrics.Performance.Enqueue_Response_Time.J2EE_ENQUEUE_RESPONSE_TIME_Enqueue_Response_Time.value'
    ],
    labels: [
      t('in-forge:plugins.sapJavaInstance.dbResponeTime'),
      t('in-forge:plugins.sapJavaInstance.enqueueResponseTime')
    ],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'metrics.Performance.Garbage_Collection',
        'value',
        t('in-forge:plugins.sapJavaInstance.garbageCollection')
      )
    ],
    labels: [t('in-forge:plugins.sapJavaInstance.garbageCollection')],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'metrics.Performance.SAP_Performance_BLS_Response_Time',
        'value',
        t('in-forge:plugins.sapJavaInstance.blsResponseTime')
      ),
      getDynamicMetricMatch(
        'metrics.Performance.Web_Service_Response_Time',
        'value',
        t('in-forge:plugins.sapJavaInstance.webServiceResponseTime')
      )
    ],
    labels: [
      t('in-forge:plugins.sapJavaInstance.blsResponseTime'),
      t('in-forge:plugins.sapJavaInstance.webServiceResponseTime')
    ],
    min: 0,
    formatter: millis
  }
];
