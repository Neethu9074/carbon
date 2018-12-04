import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import Namespaces from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Namespaces';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import { PodsWithNamespaces } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary/Summary';

export default [
  {
    label: 'Summary',
    path: `${clusterDashboardFullyQualified}/summary`,
    component: Summary
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
