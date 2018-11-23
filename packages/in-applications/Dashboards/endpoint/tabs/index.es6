import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import LogMessagesTab from 'in-applications/Dashboards/commonTabs/messages/LogMessages';
import Infrastructure from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Summary from 'in-applications/Dashboards/endpoint/tabs/Summary';
import FlowMap from 'in-applications/Dashboards/endpoint/tabs/FlowMap';
import { endpointDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${endpointDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Flow',
    path: `${endpointDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    isFullWidth: true
  },
  {
    label: 'Performance',
    path: `${endpointDashboard}/performance`,
    component: PerformanceTab
  },
  {
    label: 'Error Messages',
    path: `${endpointDashboard}/errorMessages`,
    component: ErrorMessagesTab
  },
  {
    label: 'Log Messages',
    path: `${endpointDashboard}/logMessages`,
    component: LogMessagesTab
  },
  {
    label: 'Infrastructure',
    path: `${endpointDashboard}/infrastructure`,
    component: Infrastructure
  }
].filter(v => !!v);
