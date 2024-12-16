/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const taskTypeMap = [
  {
    value: 'RFC',
    label: t('in-sap:dashboards.rfc')
  },
  {
    value: 'DIALOG',
    label: t('in-sap:dashboards.dialog')
  },
  {
    value: 'HTTP',
    label: t('in-sap:dashboards.http')
  },
  {
    value: 'HTTPS',
    label: t('in-sap:dashboards.https')
  },
  {
    value: 'BCKGRD',
    label: t('in-sap:dashboards.bckgrd')
  },
  {
    value: 'SPOOL',
    label: t('in-sap:dashboards.spool')
  },
  {
    value: 'UPDATE',
    label: t('in-sap:dashboards.statusUpdate')
  },
  {
    value: 'BUF.SYN',
    label: t('in-sap:dashboards.bufsyn')
  },
  {
    value: 'Others',
    label: t('in-sap:dashboards.statusOther')
  }
];

export const taskTypeList = ['RFC', 'HTTP', 'HTTPS', 'BCKGRD', 'SPOOL', 'UPDATE', 'BUF.SYN'];
