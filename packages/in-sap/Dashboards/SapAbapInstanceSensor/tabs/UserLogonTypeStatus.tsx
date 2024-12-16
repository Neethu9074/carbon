/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const typeMap = [
  {
    value: 'GUI',
    label: t('in-sap:dashboards.gui')
  },
  {
    value: 'Internal RFC',
    label: t('in-sap:dashboards.internalRfc')
  },
  {
    value: 'External RFC',
    label: t('in-sap:dashboards.externalRfc')
  },
  {
    value: 'Daemon',
    label: t('in-sap:dashboards.daemon')
  },
  {
    value: 'Others',
    label: t('in-sap:dashboards.6XX')
  }
];
export const typeList = ['GUI', 'Internal RFC', 'External RFC', 'Daemon'];
