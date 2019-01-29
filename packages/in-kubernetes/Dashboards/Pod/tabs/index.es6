import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Pod/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Pod/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${podDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${podDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${podDashboardFullyQualified}/events`,
    component: Events
  }
].filter(Boolean);
