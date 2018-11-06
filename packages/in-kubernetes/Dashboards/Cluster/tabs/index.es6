import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary/Summary';
import Namespaces from 'in-kubernetes/Dashboards/Cluster/tabs/Namespaces';

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
