/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/display-name */
import React from 'react';

import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import LogMessagesTab from 'in-applications/Dashboards/commonTabs/messages/LogMessages';
import Infrastructure from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Summary from 'in-applications/Dashboards/endpoint/tabs/Summary';
import FlowMap from 'in-applications/Dashboards/endpoint/tabs/FlowMap';
import { endpointDashboard } from 'in-applications/navigation/paths';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-applications:labelSummary'),
    path: `${endpointDashboard}/summary`,
    component: wrapWithMessage(Summary)
  },
  {
    label: t('in-applications:labelFlow'),
    path: `${endpointDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    stickToBottom: true,
    isFullWidth: true
  },
  role.canViewLogs && {
    label: t('in-applications:labelErrorMessages'),
    path: `${endpointDashboard}/errorMessages`,
    component: wrapWithMessage(ErrorMessagesTab)
  },
  role.canViewLogs && {
    label: t('in-applications:labelLogMessages'),
    path: `${endpointDashboard}/logMessages`,
    component: wrapWithMessage(LogMessagesTab)
  },
  {
    label: t('in-applications:labelInfrastructure'),
    path: `${endpointDashboard}/infrastructure`,
    component: wrapWithMessage(Infrastructure)
  }
].filter(v => !!v);

function wrapWithMessage(Component) {
  return props => (
    <>
      <Component {...props} />
    </>
  );
}
