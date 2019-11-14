import { vmDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import Summary from 'in-vsphere/Dashboards/Vm/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${vmDashboardFullyQualified}/summary`,
    component: Summary
  }
];
