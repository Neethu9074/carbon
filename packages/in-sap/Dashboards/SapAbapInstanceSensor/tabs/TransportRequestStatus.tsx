/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const requestStatusMap = [
  {
    value: 'Modifiable',
    label: t('in-sap:dashboards.modifiable')
  },
  {
    value: 'Protected',
    label: t('in-sap:dashboards.protected')
  },
  {
    value: 'Released',
    label: t('in-sap:dashboards.released')
  },
  {
    value: 'Released Started',
    label: t('in-sap:dashboards.releasedStarted')
  },
  {
    value: 'Others',
    label: t('in-sap:dashboards.6XX')
  }
];
export const statusList = ['Modifiable', 'Protected', 'Released', 'Release Started'];
