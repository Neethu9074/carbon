import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import LogMessagesTab from 'in-applications/Dashboards/commonTabs/messages/LogMessages';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
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
    label: 'Flow',
    path: `${serviceDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    isFullWidth: true
  },
  {
    label: 'Endpoints',
    path: `${serviceDashboard}/endpoints`,
    component: Endpoints
  },
  {
    label: 'Performance',
    path: `${serviceDashboard}/performance`,
    component: PerformanceTab
  },
  {
    label: 'Error Messages',
    path: `${serviceDashboard}/errorMessages`,
    component: ErrorMessagesTab
  },
  {
    label: 'Log Messages',
    path: `${serviceDashboard}/logMessages`,
    component: LogMessagesTab
  },
  {
    label: 'Infrastructure',
    path: `${serviceDashboard}/infrastructure`,
    component: InfrastructureTab
  }
];
