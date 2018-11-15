import { serviceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Specification from 'in-kubernetes/Dashboards/Service/tabs/Specification';
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
  }
].filter(Boolean);
