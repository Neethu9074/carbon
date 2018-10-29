import Summary from 'in-kubernetes/Dashboards/Service/tabs/Summary/Summary';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${serviceDashboard}/summary`,
    component: Summary
  }
].filter(Boolean);
