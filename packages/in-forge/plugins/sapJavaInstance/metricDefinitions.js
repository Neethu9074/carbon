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
      'metrics.Availability.DATABASE_AVAILABILITY.status',
      'metrics.Availability.DATABASE_AVAILABILITY.minValue',
      'metrics.Availability.DATABASE_AVAILABILITY.maxValue',
      'metrics.Availability.ADS_Instance_Http_Availability.ADS_AVAIL_HTTPPING.value',
      'metrics.Availability.Java_ICM_Status.JAVA_ICM_STATUS.value',
      'metrics.Availability.Java_Instance_Availability.HTTP_SERVICE_STATUS_(GRMG).value',
      'metrics.Availability.Java_Instance_Availability.JAVA_INSTANCE_HTTP_AVAILABILIT_Java_Instance_Http_Availability.value',
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
      t('in-forge:plugins.sapJavaInstance.status'),
      t('in-forge:plugins.sapJavaInstance.minValue'),
      t('in-forge:plugins.sapJavaInstance.maxValue'),
      t('in-forge:plugins.sapJavaInstance.httpAvailability'),
      t('in-forge:plugins.sapJavaInstance.iCMStatus'),
      t('in-forge:plugins.sapJavaInstance.gRMGServiceStatus'),
      t('in-forge:plugins.sapJavaInstance.instAvailability'),
      t('in-forge:plugins.sapJavaInstance.jCOStatus'),
      t('in-forge:plugins.sapJavaInstance.p4ServiceStatus'),
      t('in-forge:plugins.sapJavaInstance.servletEngineStatus'),
      t('in-forge:plugins.sapJavaInstance.webServicesStatus'),
      t('in-forge:plugins.sapJavaInstance.sCSEnqueueStatus'),
      t('in-forge:plugins.sapJavaInstance.sCSMessageServerStatus')
    ],
    min: 0,
    formatter: number.compact
  }
];
