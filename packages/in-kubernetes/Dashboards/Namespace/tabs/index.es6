import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { namespaceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import PodMapTab from 'in-kubernetes/Dashboards/Namespace/tabs/PodMapTab';
import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Namespace/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${namespaceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${namespaceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Pod Map',
    path: `${namespaceDashboardFullyQualified}/podMap`,
    component: PodMapTab
  },
  {
    label: 'Deployments',
    path: `${namespaceDashboardFullyQualified}/deployments`,
    component: Deployments,
    icon: 'lib_kubernetes_workload'
  },
  {
    label: 'Services',
    path: `${namespaceDashboardFullyQualified}/services`,
    component: Services,
    icon: 'lib_kubernetes_service'
  },
  {
    label: 'Pods',
    path: `${namespaceDashboardFullyQualified}/pods`,
    component: Pods,
    icon: 'lib_kubernetes_pod'
  }
].filter(Boolean);
