/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { businessProcessSummaryPath } from 'in-bizops/navigation/paths';
import Summary from 'in-bizops/dashboards/summary/tabs/summary/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-bizops:dashboards.summary.summaryTab'),
    path: `${businessProcessSummaryPath}`,
    component: Summary
  }
].filter(Boolean);
