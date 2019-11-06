import { hostDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import Summary from 'in-vsphere/Dashboards/Host/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${hostDashboardFullyQualified}/summary`,
    component: Summary
  }
];
