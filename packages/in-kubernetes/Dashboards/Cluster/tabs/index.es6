import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary/Summary';
import Namespaces from 'in-kubernetes/Dashboards/Cluster/tabs/Namespaces';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${clusterDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Namespaces',
    path: `${clusterDashboard}/namespaces`,
    component: Namespaces,
    icon: 'lib_kubernetes'
  }
].filter(Boolean);
