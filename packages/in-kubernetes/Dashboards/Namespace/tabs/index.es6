import { get } from 'lodash';

import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { namespaceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import getTabHeaderWithCount from 'in-kubernetes/tabs/getTabHeaderWithCount';
import PodMapTab from 'in-kubernetes/Dashboards/Namespace/tabs/PodMapTab';
import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${namespaceDashboardFullyQualified}/summary`,
    component: Summary
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
    icon: 'lib_kubernetes_workload',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'deployments')
    })
  },
  {
    label: 'Services',
    path: `${namespaceDashboardFullyQualified}/services`,
    component: Services,
    icon: 'lib_kubernetes_service',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'services')
    })
  },
  {
    label: 'Pods',
    path: `${namespaceDashboardFullyQualified}/pods`,
    component: Pods,
    icon: 'lib_kubernetes_pod',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'pods')
    })
  }
].filter(Boolean);

function getCount$(property, { timeConfig, namespaceId }) {
  return getKubernetesNamespace({ id: namespaceId, timeConfig }).map(result => get(result, ['data', property]));
}
