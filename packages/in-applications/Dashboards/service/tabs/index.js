/* eslint-disable react/display-name */
import React from 'react';

import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import LogMessagesTab from 'in-applications/Dashboards/commonTabs/messages/LogMessages';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Endpoints from 'in-applications/Dashboards/service/tabs/Endpoints';
import FlowMap from 'in-applications/Dashboards/service/tabs/FlowMap';
import Summary from 'in-applications/Dashboards/service/tabs/Summary';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { role } from 'in-stores/user';

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
    component: wrapWithMessage(Endpoints)
  },
  role.canViewLogs && {
    label: 'Error Messages',
    path: `${serviceDashboard}/errorMessages`,
    component: wrapWithMessage(ErrorMessagesTab)
  },
  role.canViewLogs && {
    label: 'Log Messages',
    path: `${serviceDashboard}/logMessages`,
    component: wrapWithMessage(LogMessagesTab)
  },
  {
    label: 'Infrastructure',
    path: `${serviceDashboard}/infrastructure`,
    component: wrapWithMessage(InfrastructureTab)
  }
].filter(Boolean);

function wrapWithMessage(Component) {
  return props => (
    <>
      <Component {...props} />
    </>
  );
}
