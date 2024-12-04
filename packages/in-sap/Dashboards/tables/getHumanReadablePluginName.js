/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export const getHumanReadablePluginName = function (value) {
  switch (value.pluginName) {
    case 'abapInstance':
    case 'sapAbapInstanceSensor':
      return 'ABAP Instance';
    case 'sapDbInstance':
      return 'DB Instance';
    case 'sapDbms':
      return 'Db2';
    case 'sapDbTenant':
      return 'DB Tenant';
    case 'sapHanaPlatform':
      return 'HANA';
    case 'sapJavaInstance':
      return 'Java Instance';
    case 'sapJavaSystem':
      return 'Java System';
    case 'sapHanaSystem':
      return 'Hana System';
    case 'sapWebDispatcher':
      return 'Web Dispatcher';
    case 'sapAbapSystemSensor':
      return 'ABAP System';
    case 'db2Database':
      return 'DB2';
    case 'sapHana':
      return 'SAP HANA';
    default:
      return 'ABAP System';
  }
};
