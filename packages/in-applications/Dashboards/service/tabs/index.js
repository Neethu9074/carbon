/* eslint-disable react/display-name */
import React from 'react';

import ServiceDashboardNotifications from 'in-applications/Dashboards/service/components/ServiceDashboardNotifications';
import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
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
    component: wrapWithMessage(Summary)
  },
  {
    label: 'Flow',
    path: `${serviceDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    stickToBottom: true,
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
    component: wrapWithMessage(PerformanceTab)
  },
  {
    label: 'Error Messages',
    path: `${serviceDashboard}/errorMessages`,
    component: wrapWithMessage(ErrorMessagesTab)
  },
  {
    label: 'Log Messages',
    path: `${serviceDashboard}/logMessages`,
    component: wrapWithMessage(LogMessagesTab)
  },
  {
    label: 'Infrastructure',
    path: `${serviceDashboard}/infrastructure`,
    component: wrapWithMessage(InfrastructureTab)
  }
];

function wrapWithMessage(Component) {
  return props => (
    <>
      <ServiceDashboardNotifications {...props} />
      <Component {...props} />
    </>
  );
}
