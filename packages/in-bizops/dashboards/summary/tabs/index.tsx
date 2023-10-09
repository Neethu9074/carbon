/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { businessProcessSummaryPath, businessProcessActivityListPath } from 'in-bizops/navigation/paths';
import Activities from 'in-bizops/dashboards/summary/tabs/activities/Activities';
import Summary from 'in-bizops/dashboards/summary/tabs/summary/Summary';
import { t } from 'in-i18n';

function enableActivityTab() {
  let tabs = [
    {
      label: t('in-bizops:dashboards.summary.summaryTab'),
      path: `${businessProcessSummaryPath}`,
      component: Summary
    }
  ];
  tabs.push({
    label: t('in-bizops:dashboards.summary.activitiesTab'),
    path: `${businessProcessActivityListPath}`,
    component: Activities
  });
  return tabs;
}

export default enableActivityTab().filter(Boolean);
