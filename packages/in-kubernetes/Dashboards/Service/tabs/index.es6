import { serviceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Service/tabs/Summary/Summary';
import Details from 'in-kubernetes/Dashboards/Service/tabs/Details';
import Events from 'in-kubernetes/Dashboards/Service/tabs/Events';

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
    label: 'Pods',
    path: `${serviceDashboardFullyQualified}/pods`,
    component: Pods,
    icon: 'lib_kubernetes_pod'
  },
  {
    label: 'Events',
    path: `${serviceDashboardFullyQualified}/events`,
    component: Events
  }
].filter(Boolean);
