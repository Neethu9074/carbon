import { namespaceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary/Summary';
import Services from 'in-kubernetes/Dashboards/Namespace/tabs/Services';
// import Pods from 'in-kubernetes/Dashboards/Namespace/tabs/Pods';

export default [
  {
    label: 'Summary',
    path: `${namespaceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Services',
    path: `${namespaceDashboardFullyQualified}/services`,
    component: Services,
    icon: 'lib_kubernetes_service'
  }
  // {
  //   label: 'Pods',
  //   path: `${namespaceDashboardFullyQualified}/pods`,
  //   component: Pods,
  //   icon: 'lib_kubernetes_pod'
  // }
].filter(Boolean);
