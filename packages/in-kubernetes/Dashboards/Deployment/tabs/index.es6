import { deploymentDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Deployment/tabs/Summary/Summary';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';

export default [
  {
    label: 'Summary',
    path: `${deploymentDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Pods',
    path: `${deploymentDashboardFullyQualified}/pods`,
    component: Pods,
    icon: 'lib_kubernetes_pod'
  }
].filter(Boolean);
