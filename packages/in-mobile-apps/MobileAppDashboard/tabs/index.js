import Configuration from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Configuration';
import HttpRequests from 'in-mobile-apps/MobileAppDashboard/tabs/HttpRequests';
import Views from 'in-mobile-apps/MobileAppDashboard/tabs/Views';
import { mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import Summary from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/Summary';

export const mobileAppTabs = [
  {
    label: 'Summary',
    path: `${mobileAppPathFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'HTTP Requests',
    path: `${mobileAppPathFullyQualified}/httpRequests`,
    component: HttpRequests
  },
  {
    label: 'Views',
    path: `${mobileAppPathFullyQualified}/views`,
    component: Views,
    mobileAppOnly: true
  },
  {
    label: 'Configuration',
    path: `${mobileAppPathFullyQualified}/configuration`,
    component: Configuration,
    mobileAppOnly: true
  }
].filter(Boolean);

export const viewTabs = mobileAppTabs.filter(tab => !tab.mobileAppOnly);
