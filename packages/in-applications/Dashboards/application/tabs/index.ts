/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import SyntheticsList from 'in-applications/Dashboards/application/tabs/SyntheticsMonitoring/SyntheticsList';
import ReadOnlyConfiguration from 'in-applications/Dashboards/application/tabs/ReadOnlyConfiguration';
import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import Configuration from 'in-applications/Dashboards/application/tabs/Configuration';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import LogMessagesTab from 'in-logging/components/Dashboards/components/LogMessages';
import { hasInfrastructureAccess, hasSyntheticsAccess } from 'in-stores/permission';
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import Alerts from 'in-applications/Dashboards/application/tabs/Alerts';
import { applicationDashboard } from 'in-applications/navigation/paths';
import Map from 'in-applications/Dashboards/application/tabs/Map';
import { playwithEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const getApplicationTabs = canConfigureApplications => {
  return [
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
    hasInfrastructureAccess && {
      label: t('in-applications:labelInfrastructure'),
      path: `${applicationDashboard}/infrastructure`,
      component: InfrastructureTab
    },
    hasSyntheticsAccess &&
      !playwithEnabled && {
        label: t('in-applications:labelSyntheticMonitoring'),
        path: `${applicationDashboard}/synthetics`,
        component: SyntheticsList
      },
    {
      label: t('in-applications:labelSmartAlerts'),
      path: `${applicationDashboard}/alerts`,
      component: Alerts
    },
    !playwithEnabled && {
      label: t('in-applications:labelConfiguration'),
      path: `${applicationDashboard}/configuration`,
      component: canConfigureApplications ? Configuration : ReadOnlyConfiguration
    }
  ].filter(Boolean);
};

export default getApplicationTabs;
