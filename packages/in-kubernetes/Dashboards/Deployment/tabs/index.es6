import { deploymentDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Deployment/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Deployment/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${deploymentDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${deploymentDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Pods',
    path: `${deploymentDashboardFullyQualified}/pods`,
    component: Pods
  }
].filter(Boolean);
