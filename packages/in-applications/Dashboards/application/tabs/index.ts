/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

//@ts-expect-error needs TS migration
import ReadOnlyConfiguration from 'in-applications/Dashboards/application/tabs/ReadOnlyConfiguration';
//@ts-expect-error needs TS migration
import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
//@ts-expect-error needs TS migration
import Configuration from 'in-applications/Dashboards/application/tabs/Configuration';
//@ts-expect-error needs TS migration
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
//@ts-expect-error needs TS migration
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
//@ts-expect-error needs TS migration
import Services from 'in-applications/Dashboards/application/tabs/Services';
//@ts-expect-error needs TS migration
import Alerts from 'in-applications/Dashboards/application/tabs/Alerts';
import SyntheticsList from 'in-applications/Dashboards/application/tabs/SyntheticsMonitoring/SyntheticsList';
import { resourceOptimizationActionsEnabled, vulnerabilityCenterEnabled } from 'in-services/featureFlags';
import ResourceOptimizationTab from 'in-applications/Dashboards/application/tabs/ResourceOptimizations';
//@ts-expect-error needs TS migration
import Map from 'in-applications/Dashboards/application/tabs/Map';
import SloDashboardList from 'in-service-levels/components/Shared/SloDashboardList/SloDashboardList';
import CveVulnerabilities from 'in-applications/Dashboards/application/tabs/CveVulnerabilities';
import LogMessagesTab from 'in-logging/components/Dashboards/components/LogMessages';
import { hasInfrastructureAccess, hasSyntheticsAccess } from 'in-stores/permission';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { playwithEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const getApplicationTabs = (canConfigureApplications: boolean | null | undefined) => {
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
    role?.canViewLogs && {
      label: t('in-applications:labelErrorMessages'),
      path: `${applicationDashboard}/errorMessages`,
      component: ErrorMessagesTab
    },
    role?.canViewLogs && {
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
    vulnerabilityCenterEnabled && {
      label: t('in-events:labelCveIssue'),
      path: `${applicationDashboard}/CveVulnerabilities`,
      component: CveVulnerabilities
    },
    resourceOptimizationActionsEnabled && {
      label: t('in-applications:labelResourceOptimizations'),
      path: `${applicationDashboard}/resourceOptimizations`,
      component: ResourceOptimizationTab
    },
    {
      label: t('in-applications:labelSmartAlerts'),
      path: `${applicationDashboard}/alerts`,
      component: Alerts
    },
    {
      label: t('in-applications:labelServiceLevels'),
      path: `${applicationDashboard}/slo`,
      component: SloDashboardList
    },
    !playwithEnabled && {
      label: t('in-applications:labelConfiguration'),
      path: `${applicationDashboard}/configuration`,
      component: canConfigureApplications ? Configuration : ReadOnlyConfiguration
    }
  ].filter(Boolean) as Array<Tab<any, any>>;
};

export default getApplicationTabs;
