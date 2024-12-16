/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const statusMap = [
  {
    value: 'Running',
    label: t('in-sap:dashboards.running')
  },
  {
    value: 'Ready',
    label: t('in-sap:dashboards.ready')
  },
  {
    value: 'Scheduled',
    label: t('in-sap:dashboards.scheduled')
  },
  {
    value: 'Released',
    label: t('in-sap:dashboards.released')
  },
  {
    value: 'Aborted',
    label: t('in-sap:dashboards.aborted')
  },
  {
    value: 'Finished',
    label: t('in-sap:dashboards.finished')
  },
  {
    value: 'Active',
    label: t('in-sap:dashboards.active')
  },
  {
    value: 'Unknown State',
    label: t('in-sap:dashboards.unknownState')
  }
];
