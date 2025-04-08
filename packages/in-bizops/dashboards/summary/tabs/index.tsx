/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  businessProcessSummaryPath,
  businessProcessActivityListPath,
  businessProcessFlowMapPath
} from 'in-bizops/navigation/paths';
import BusinessProcessFlowMap from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMap';
import Activities from 'in-bizops/dashboards/summary/tabs/activities/Activities';
import Summary from 'in-bizops/dashboards/summary/tabs/summary/Summary';
import { t } from 'in-i18n';

function enableActivityTab() {
  const tabs = [
    {
      label: t('in-bizops:dashboards.summary.summaryTab'),
      path: `${businessProcessSummaryPath}`,
      component: Summary
    },
    {
      label: t('in-bizops:dashboards.summary.activitiesTab'),
      path: `${businessProcessActivityListPath}`,
      component: Activities
    },
    {
      label: t('in-bizops:dashboards.flowMap.tabLabel'),
      path: businessProcessFlowMapPath,
      component: BusinessProcessFlowMap
    }
  ];
  return tabs;
}

export default enableActivityTab().filter(Boolean);
