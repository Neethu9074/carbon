import { get } from 'lodash';

import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import { deploymentDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Deployment/tabs/Summary/Summary';
import getTabHeaderWithCount from 'in-kubernetes/tabs/getTabHeaderWithCount';
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
    icon: 'lib_kubernetes_pod',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'pods')
    })
  }
].filter(Boolean);

function getCount$(property, { timeConfig, deploymentId }) {
  return getKubernetesDeployment({ id: deploymentId, timeConfig }).map(result => get(result, ['data', property]));
}
