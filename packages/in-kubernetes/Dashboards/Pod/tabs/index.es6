import { get } from 'lodash';

import getTabHeaderWithCount from 'in-kubernetes/tabs/getTabHeaderWithCount';
import { podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import Containers from 'in-kubernetes/Dashboards/Pod/tabs/Containers';
import Summary from 'in-kubernetes/Dashboards/Pod/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${podDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Containers',
    path: `${podDashboardFullyQualified}/containers`,
    component: Containers,
    icon: 'lib_container',
    header: getTabHeaderWithCount({
      getCount$: getCount$.bind(null, 'containers')
    })
  }
].filter(Boolean);

function getCount$(property, { timeConfig, podId }) {
  return getKubernetesPod({ id: podId, timeConfig }).map(result => get(result, ['data', property]));
}
