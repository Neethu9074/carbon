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

export default [
  {
    label: 'Summary',
    path: `${applicationDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Dependencies',
    path: `${applicationDashboard}/map`,
    component: Map,
    stickToHeader: true,
    stickToBottom: true,
    isFullWidth: true
  },
  {
    label: 'Services',
    path: `${applicationDashboard}/services`,
    component: Services
  },
  role.canViewLogs && {
    label: 'Error Messages',
    path: `${applicationDashboard}/errorMessages`,
    component: ErrorMessagesTab
  },
  role.canViewLogs && {
    label: 'Log Messages',
    path: `${applicationDashboard}/logMessages`,
    component: LogMessagesTab
  },
  {
    label: 'Infrastructure',
    path: `${applicationDashboard}/infrastructure`,
    component: InfrastructureTab
  },
  applicationSmartAlertsEnabled && {
    label: 'Alerts',
    path: `${applicationDashboard}/alerts`,
    component: Alerts
  },
  role.canConfigureApplications && {
    label: 'Configuration',
    path: `${applicationDashboard}/configuration`,
    component: Configuration
  }
].filter(Boolean);
