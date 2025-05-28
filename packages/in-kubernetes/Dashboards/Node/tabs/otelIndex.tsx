/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error TS migration
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Node/tabs/SummaryWithoutTimeShift';
import {
  beeInstanaInfraMetricsEnabled,
  beeinstanaInfraMetricsWithTimeshiftEnabled
} from 'in-services/featureFlags';
// @ts-expect-error TS migration
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
// @ts-expect-error TS migration
import { NodePodTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import { nodeOtelDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import OtelSummary from 'in-kubernetes/Dashboards/Node/tabs/OtelSummary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${nodeOtelDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? OtelSummary : SummaryWithoutTimeShift
  },
  {
      label: t('in-kubernetes:dashboards.pods'),
      path: `${nodeOtelDashboardFullyQualified}/pods`,
      component: Pods,
      header: NodePodTab
    }
].filter(Boolean);
