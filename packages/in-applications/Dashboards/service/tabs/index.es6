import Infrastructure from 'in-applications/Dashboards/service/tabs/Infrastructure';
import Performance from 'in-applications/Dashboards/service/tabs/Performance';
import Endpoints from 'in-applications/Dashboards/service/tabs/Endpoints';
import FlowMap from 'in-applications/Dashboards/service/tabs/FlowMap';
import Summary from 'in-applications/Dashboards/service/tabs/Summary';
import { serviceDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${serviceDashboard}/summary`,
    component: Summary
  },
  {
    label: 'FlowMap',
    path: `${serviceDashboard}/flowMap`,
    component: FlowMap
  },
  {
    label: 'Endpoints',
    path: `${serviceDashboard}/endpoints`,
    component: Endpoints
  },
  {
    label: 'Performance',
    path: `${serviceDashboard}/performance`,
    component: Performance
  },
  {
    label: 'Infrastructure',
    path: `${serviceDashboard}/infrastructure`,
    component: Infrastructure
  }
];
