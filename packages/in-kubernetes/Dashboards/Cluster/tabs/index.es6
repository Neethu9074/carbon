import { PodsWithNamespaces } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import Namespaces from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Namespaces';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import Details from 'in-kubernetes/Dashboards/Cluster/tabs/Details';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${clusterDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${clusterDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Nodes',
    path: `${clusterDashboardFullyQualified}/nodes`,
    component: Nodes,
    icon: 'lib_kubernetes_node'
  },
  {
    label: 'Namespaces',
    path: `${clusterDashboardFullyQualified}/namespaces`,
    component: Namespaces,
    icon: 'lib_kubernetes_namespace'
  },
  {
    label: 'Deployments',
    path: `${clusterDashboardFullyQualified}/deployments`,
    component: Deployments,
    icon: 'lib_kubernetes_workload'
  },
  {
    label: 'Services',
    path: `${clusterDashboardFullyQualified}/services`,
    component: Services,
    icon: 'lib_kubernetes_service'
  },
  {
    label: 'Pods',
    path: `${clusterDashboardFullyQualified}/pods`,
    component: PodsWithNamespaces,
    icon: 'lib_kubernetes_pod'
  }
].filter(Boolean);
