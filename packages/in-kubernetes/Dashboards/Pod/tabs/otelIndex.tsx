/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error TS migration
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Pod/tabs/Summary/SummaryWithoutTimeShift';
import {
  beeInstanaInfraMetricsEnabled,
  beeinstanaInfraMetricsWithTimeshiftEnabled,
} from 'in-services/featureFlags';
// @ts-expect-error TS migration
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
// @ts-expect-error TS migration
import { PodConditionsTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
// @ts-expect-error TS migration
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
// @ts-expect-error TS migration
import Infrastructure from 'in-kubernetes/Dashboards/Pod/tabs/Infrastructure';
// @ts-expect-error TS migration
import Details from 'in-kubernetes/Dashboards/Pod/tabs/Details/Details';
import { podOtelDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Pod/tabs/Summary/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${podOtelDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
  },
  {
    label: t('in-kubernetes:dashboards.containers'),
    path: `${podOtelDashboardFullyQualified}/containers`,
    component: Infrastructure
  }
].filter(Boolean);
