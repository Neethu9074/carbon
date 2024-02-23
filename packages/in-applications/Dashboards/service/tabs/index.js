/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/display-name */
import React from 'react';

import Troubleshooting from 'in-applications/Dashboards/service/tabs/troubleshooting/Troubleshooting';
import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import LogMessagesTab from 'in-components/Logging/Dashboards/components/LogMessages';
import Endpoints from 'in-applications/Dashboards/service/tabs/Endpoints';
import FlowMap from 'in-applications/Dashboards/service/tabs/FlowMap';
import Summary from 'in-applications/Dashboards/service/tabs/Summary';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { flowMapEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-applications:labelSummary'),
    path: `${serviceDashboard}/summary`,
    component: wrapWithMessage(Summary)
  },
  flowMapEnabled && {
    label: t('in-applications:labelFlow'),
    path: `${serviceDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    stickToBottom: true,
    isFullWidth: true
  },
  {
    label: t('in-applications:labelEndpoints'),
    path: `${serviceDashboard}/endpoints`,
    component: wrapWithMessage(Endpoints)
  },
  role.canViewLogs && {
    label: t('in-applications:labelErrorMessages'),
    path: `${serviceDashboard}/errorMessages`,
    component: wrapWithMessage(ErrorMessagesTab)
  },
  role.canViewLogs && {
    label: t('in-applications:labelLogMessages'),
    path: `${serviceDashboard}/logMessages`,
    component: wrapWithMessage(LogMessagesTab)
  },
  {
    label: t('in-applications:labelInfrastructure'),
    path: `${serviceDashboard}/infrastructure`,
    component: wrapWithMessage(InfrastructureTab)
  },
  {
    label: t('in-applications:labelTroubleshooting'),
    path: `${serviceDashboard}/troubleshooting`,
    component: wrapWithMessage(Troubleshooting),
    isInternal: true
  }
].filter(Boolean);

function wrapWithMessage(Component) {
  return props => (
    <>
      <Component {...props} />
    </>
  );
}
