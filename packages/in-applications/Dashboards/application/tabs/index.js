/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import LogMessagesTab from 'in-applications/Dashboards/commonTabs/messages/LogMessages';
import Configuration from 'in-applications/Dashboards/application/tabs/Configuration';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import Alerts from 'in-applications/Dashboards/application/tabs/Alerts';
import { applicationDashboard } from 'in-applications/navigation/paths';
import Map from 'in-applications/Dashboards/application/tabs/Map';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-applications:labelSummary'),
    path: `${applicationDashboard}/summary`,
    component: Summary
  },
  {
    label: t('in-applications:labelDependencies'),
    path: `${applicationDashboard}/map`,
    component: Map,
    stickToHeader: true,
    stickToBottom: true,
    isFullWidth: true
  },
  {
    label: t('in-applications:labelServices'),
    path: `${applicationDashboard}/services`,
    component: Services
  },
  role.canViewLogs && {
    label: t('in-applications:labelErrorMessages'),
    path: `${applicationDashboard}/errorMessages`,
    component: ErrorMessagesTab
  },
  role.canViewLogs && {
    label: t('in-applications:labelLogMessages'),
    path: `${applicationDashboard}/logMessages`,
    component: LogMessagesTab
  },
  {
    label: t('in-applications:labelInfrastructure'),
    path: `${applicationDashboard}/infrastructure`,
    component: InfrastructureTab
  },
  applicationSmartAlertsEnabled && {
    label: t('in-applications:labelAlerts'),
    path: `${applicationDashboard}/alerts`,
    component: Alerts
  },
  role.canConfigureApplications && {
    label: t('in-applications:labelConfiguration'),
    path: `${applicationDashboard}/configuration`,
    component: Configuration
  }
].filter(Boolean);
