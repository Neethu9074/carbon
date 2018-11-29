import { get } from 'lodash';

import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import { serviceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Specification from 'in-kubernetes/Dashboards/Service/tabs/Specification';
import getTabHeaderWithCount from 'in-kubernetes/tabs/getTabHeaderWithCount';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Service/tabs/Summary/Summary';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import Ports from 'in-kubernetes/Dashboards/Service/tabs/Ports';

export default [
  {
    label: 'Summary',
    path: `${serviceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Specification',
    path: `${serviceDashboardFullyQualified}/specification`,
    component: Specification
  },
  {
    label: 'Endpoints',
    path: `${serviceDashboardFullyQualified}/endpoints`,
    component: Endpoints
  },
  {
    label: 'Ports',
    path: `${serviceDashboardFullyQualified}/ports`,
    component: Ports
  },
  {
    label: 'Pods',
    path: `${serviceDashboardFullyQualified}/pods`,
    component: Pods,
    icon: 'lib_kubernetes_pod',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'pods')
    })
  }
].filter(Boolean);

function getCount$(property, { timeConfig, serviceId }) {
  return getKubernetesService({ id: serviceId, timeConfig }).map(result => get(result, ['data', property]));
}
