/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export const getHumanReadablePluginName = function (value) {
  switch (value.pluginName) {
    case 'abapInstance':
      return 'ABAP Instance';
    case 'sapDbInstance':
      return 'DB Instance';
    case 'sapDbms':
      return 'DBMS';
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
    default:
      return 'ABAP System';
  }
};
