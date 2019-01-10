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
    component: Nodes
  },
  {
    label: 'Namespaces',
    path: `${clusterDashboardFullyQualified}/namespaces`,
    component: Namespaces
  },
  {
    label: 'Deployments',
    path: `${clusterDashboardFullyQualified}/deployments`,
    component: Deployments
  },
  {
    label: 'K8s Services',
    path: `${clusterDashboardFullyQualified}/services`,
    component: Services
  },
  {
    label: 'Pods',
    path: `${clusterDashboardFullyQualified}/pods`,
    component: PodsWithNamespaces
  }
].filter(Boolean);
