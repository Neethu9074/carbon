/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { CronJobConditionsTab, CronJobPodTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import { cronJobDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Details from 'in-kubernetes/Dashboards/CronJob/tabs/Details';
import Summary from 'in-kubernetes/Dashboards/CronJob/tabs/Summary';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${cronJobDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${cronJobDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.conditions'),
    path: `${cronJobDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: CronJobConditionsTab
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${cronJobDashboardFullyQualified}/pods`,
    component: Pods,
    header: CronJobPodTab
  }
].filter(Boolean);
