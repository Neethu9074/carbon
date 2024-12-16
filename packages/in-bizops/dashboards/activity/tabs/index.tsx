/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { businessActivityServiceListPath, businessActivitySummaryPath } from 'in-bizops/navigation/paths';
import Services from 'in-bizops/dashboards/activity/tabs/services/Services';
import Summary from 'in-bizops/dashboards/activity/tabs/summary/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-bizops:dashboards.activity.summaryTab'),
    path: `${businessActivitySummaryPath}`,
    component: Summary
  },
  {
    label: t('in-bizops:dashboards.activity.servicesTab'),
    path: `${businessActivityServiceListPath}`,
    component: Services
  }
].filter(Boolean);
