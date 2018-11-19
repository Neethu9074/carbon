import { get } from 'lodash';

import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import getTabHeaderWithCount from 'in-kubernetes/tabs/getTabHeaderWithCount';
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
    icon: 'lib_kubernetes_namespace',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'namespaces')
    })
  },
  {
    label: 'Services',
    path: `${clusterDashboardFullyQualified}/services`,
    component: Services,
    icon: 'lib_kubernetes_service',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'services')
    })
  },
  {
    label: 'Deployments',
    path: `${clusterDashboardFullyQualified}/deployments`,
    component: Deployments,
    icon: 'lib_kubernetes_workload',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'deployments')
    })
  },
  {
    label: 'Nodes',
    path: `${clusterDashboardFullyQualified}/nodes`,
    component: Nodes,
    icon: 'lib_kubernetes_node',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'nodes')
    })
  },
  {
    label: 'Pods',
    path: `${clusterDashboardFullyQualified}/pods`,
    component: Pods,
    icon: 'lib_kubernetes_pod',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'pods')
    })
  }
].filter(Boolean);

function getCount$(property, { timeConfig, clusterId }) {
  return getKubernetesCluster({ id: clusterId, timeConfig }).map(result => get(result, ['data', property]));
}
