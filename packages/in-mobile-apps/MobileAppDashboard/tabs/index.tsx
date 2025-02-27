/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error Could not find a declaration file for module
import Configuration from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Configuration';
// @ts-expect-error Could not find a declaration file for module
import Geography from 'in-mobile-apps/MobileAppDashboard/tabs/Geography/Geography';
import {
  mobileAppCrashBeaconEnabled,
  syntheticRbacLimitedEnabled,
  mobileAppPerformanceTabEnabled
} from 'in-services/featureFlags';
import SyntheticMonitoring from 'in-mobile-apps/MobileAppDashboard/tabs/SyntheticMonitoring/SyntheticMonitoring';
import Performance from 'in-mobile-apps/MobileAppDashboard/tabs/Performance/Performance';
import CustomEvents from 'in-mobile-apps/MobileAppDashboard/tabs/CustomEvents';
import HttpRequests from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests';
import { mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import Summary from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/Summary';
import Crashes from 'in-mobile-apps/MobileAppDashboard/tabs/Crashes';
import Alerts from 'in-mobile-apps/MobileAppDashboard/tabs/Alerts';
import Views from 'in-mobile-apps/MobileAppDashboard/tabs/Views';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface MobileAppTab extends Tab<{}, {}> {
  mobileAppOnly?: boolean;
}

export const mobileAppTabs: Array<MobileAppTab> = [
  {
    label: t('in-mobile-apps:dashboard.tabs.summaryLabel'),
    path: `${mobileAppPathFullyQualified}/summary`,
    component: Summary
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

export const viewTabs = mobileAppTabs.filter(tab => !tab.mobileAppOnly);
