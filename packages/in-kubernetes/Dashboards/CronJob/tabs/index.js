import { CronJobConditionsTab, CronJobPodTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import { cronJobDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Details from 'in-kubernetes/Dashboards/CronJob/tabs/Details';
import Summary from 'in-kubernetes/Dashboards/CronJob/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${cronJobDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${cronJobDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Conditions',
    path: `${cronJobDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: CronJobConditionsTab
  },
  {
    label: 'Pods',
    path: `${cronJobDashboardFullyQualified}/pods`,
    component: Pods,
    header: CronJobPodTab
  }
].filter(Boolean);
