import { serviceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Service/tabs/Summary/Summary';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import Details from 'in-kubernetes/Dashboards/Service/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${serviceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${serviceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Endpoints',
    path: `${serviceDashboardFullyQualified}/endpoints`,
    component: Endpoints
  },
  {
    label: 'Pods',
    path: `${serviceDashboardFullyQualified}/pods`,
    component: Pods,
    icon: 'lib_kubernetes_pod'
  }
].filter(Boolean);
