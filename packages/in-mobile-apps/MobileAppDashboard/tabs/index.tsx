/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  mobileAppCrashBeaconEnabled,
  syntheticRbacLimitedEnabled,
  mobileAppPerformanceTabEnabled,
  mobileAppFastTriageEnabled
} from 'in-services/featureFlags';
// @ts-expect-error Could not find a declaration file for module
import Configuration from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Configuration';
// @ts-expect-error Could not find a declaration file for module
import Geography from 'in-mobile-apps/MobileAppDashboard/tabs/Geography/Geography';
import SyntheticMonitoring from 'in-mobile-apps/MobileAppDashboard/tabs/SyntheticMonitoring/SyntheticMonitoring';
import Dependency from 'in-mobile-apps/MobileAppDashboard/tabs/Dependency/Dependency';
import CustomEvents from 'in-mobile-apps/MobileAppDashboard/tabs/CustomEvents';
import HttpRequests from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests';
import { mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import Performance from 'in-mobile-apps/MobileAppDashboard/tabs/Performance';
import Summary from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/Summary';
import Crashes from 'in-mobile-apps/MobileAppDashboard/tabs/Crashes';
import Alerts from 'in-mobile-apps/MobileAppDashboard/tabs/Alerts';
import Views from 'in-mobile-apps/MobileAppDashboard/tabs/Views';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { Role } from 'in-types';
import { t } from 'in-i18n';

interface MobileAppTab extends Tab<{}, {}> {
  mobileAppOnly?: boolean;
}

export const getMobileAppTabs = (role: Role): Array<MobileAppTab> =>
  [
    {
      label: t('in-mobile-apps:dashboard.tabs.summaryLabel'),
      path: `${mobileAppPathFullyQualified}/summary`,
      component: Summary
    },
    mobileAppFastTriageEnabled && {
      label: t('in-mobile-apps:dashboard.tabs.dependencyLabel'),
      path: `${mobileAppPathFullyQualified}/dependency`,
      component: Dependency
    },
    mobileAppPerformanceTabEnabled && {
      label: t('in-mobile-apps:dashboard.tabs.performanceLabel'),
      path: `${mobileAppPathFullyQualified}/performance`,
      component: Performance
    },
    {
      label: t('in-mobile-apps:dashboard.tabs.httpRequestLabel'),
      path: `${mobileAppPathFullyQualified}/httpRequests`,
      component: HttpRequests
    },
    mobileAppCrashBeaconEnabled && {
      label: t('in-mobile-apps:dashboard.tabs.crashLabel'),
      path: `${mobileAppPathFullyQualified}/crashes`,
      component: Crashes
    },
    {
      label: t('in-mobile-apps:dashboard.tabs.geographyLabel'),
      path: `${mobileAppPathFullyQualified}/geography`,
      component: Geography,
      mobileAppOnly: true
    },
    {
      label: t('in-mobile-apps:dashboard.tabs.viewsLabel'),
      path: `${mobileAppPathFullyQualified}/views`,
      component: Views,
      mobileAppOnly: true
    },
    {
      label: t('in-mobile-apps:dashboard.tabs.customEventsLabel'),
      path: `${mobileAppPathFullyQualified}/customEvents`,
      component: CustomEvents
    },
    syntheticRbacLimitedEnabled && {
      label: t('in-mobile-apps:dashboard.tabs.syntheticMonitoringLabel'),
      path: `${mobileAppPathFullyQualified}/synthetics`,
      component: SyntheticMonitoring,
      mobileAppOnly: true
    },
    {
      label: t('in-mobile-apps:dashboard.tabs.smartAlerts'),
      path: `${mobileAppPathFullyQualified}/alerts`,
      component: Alerts
    },
    role?.canConfigureMobileAppMonitoring && {
      label: t('in-mobile-apps:dashboard.tabs.configurationLabel'),
      path: `${mobileAppPathFullyQualified}/configuration`,
      component: Configuration,
      mobileAppOnly: true
    }
  ].filter(Boolean) as Array<MobileAppTab>;

export const getViewTabs = (role: Role) => getMobileAppTabs(role).filter(tab => !tab.mobileAppOnly);
