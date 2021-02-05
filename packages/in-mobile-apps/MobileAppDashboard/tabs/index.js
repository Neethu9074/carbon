/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import Configuration from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Configuration';
import Geography from 'in-mobile-apps/MobileAppDashboard/tabs/Geography/Geography';
import HttpRequests from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests';
import { mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import Summary from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/Summary';
import Views from 'in-mobile-apps/MobileAppDashboard/tabs/Views';
import { role } from 'in-stores/user';

export const mobileAppTabs = [
  {
    label: t('in-mobile-apps:dashboard.tabs.summaryLabel'),
    path: `${mobileAppPathFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-mobile-apps:dashboard.tabs.httpRequestLabel'),
    path: `${mobileAppPathFullyQualified}/httpRequests`,
    component: HttpRequests
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
  role.canConfigureMobileAppMonitoring && {
    label: t('in-mobile-apps:dashboard.tabs.configurationLabel'),
    path: `${mobileAppPathFullyQualified}/configuration`,
    component: Configuration,
    mobileAppOnly: true
  }
].filter(Boolean);

export const viewTabs = mobileAppTabs.filter(tab => !tab.mobileAppOnly);
