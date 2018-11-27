import { podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
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
    icon: 'lib_container'
  }
].filter(Boolean);
