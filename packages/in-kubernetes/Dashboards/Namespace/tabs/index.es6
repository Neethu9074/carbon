import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary/Summary';
import Services from 'in-kubernetes/Dashboards/Namespace/tabs/Services';
import { namespaceDashboard } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/Namespace/tabs/Pods';

export default [
  {
    label: 'Summary',
    path: `${namespaceDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Services',
    path: `${namespaceDashboard}/services`,
    component: Services,
    icon: 'lib_kubernetes'
  },
  {
    label: 'Pods',
    path: `${namespaceDashboard}/pods`,
    component: Pods,
    icon: 'lib_kubernetes'
  }
].filter(Boolean);
