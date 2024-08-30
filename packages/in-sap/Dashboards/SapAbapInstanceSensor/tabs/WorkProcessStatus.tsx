/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const workProcessStatusMap = [
  {
    value: 'Waiting',
    label: t('in-sap:dashboards.waiting')
  },
  {
    value: 'Running',
    label: t('in-sap:dashboards.running')
  },
  {
    value: 'On Hold',
    label: t('in-sap:dashboards.onHold')
  },
  {
    value: 'Stopped',
    label: t('in-sap:dashboards.stopped')
  },
  {
    value: 'Shutdown',
    label: t('in-sap:dashboards.shutdown')
  },
  {
    value: 'Reserved',
    label: t('in-sap:dashboards.reserved')
  }
];
