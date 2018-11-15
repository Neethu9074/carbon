import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Namespaces from 'in-kubernetes/Dashboards/Cluster/tabs/Namespaces';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${clusterDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Namespaces',
    path: `${clusterDashboardFullyQualified}/namespaces`,
    component: Namespaces,
    icon: 'lib_kubernetes_namespace'
  }
].filter(Boolean);
