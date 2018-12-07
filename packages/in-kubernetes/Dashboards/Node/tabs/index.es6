import { nodeDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Node/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Node/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${nodeDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${nodeDashboardFullyQualified}/details`,
    component: Details
  }
].filter(Boolean);
