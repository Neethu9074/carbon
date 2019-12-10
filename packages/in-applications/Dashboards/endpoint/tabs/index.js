import React from 'react';

import EndpointDashboardNotifications from 'in-applications/Dashboards/endpoint/components/EndpointDashboardNotifications';
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
    component: wrapWithMessage(Summary)
  },
  {
    label: 'Flow',
    path: `${endpointDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    stickToBottom: true,
    isFullWidth: true
  },
  {
    label: 'Performance',
    path: `${endpointDashboard}/performance`,
    component: wrapWithMessage(PerformanceTab)
  },
  {
    label: 'Error Messages',
    path: `${endpointDashboard}/errorMessages`,
    component: wrapWithMessage(ErrorMessagesTab)
  },
  {
    label: 'Log Messages',
    path: `${endpointDashboard}/logMessages`,
    component: wrapWithMessage(LogMessagesTab)
  },
  {
    label: 'Infrastructure',
    path: `${endpointDashboard}/infrastructure`,
    component: wrapWithMessage(Infrastructure)
  }
].filter(v => !!v);

function wrapWithMessage(Component) {
  return props => (
    <>
      <EndpointDashboardNotifications {...props} />
      <Component {...props} />
    </>
  );
}
