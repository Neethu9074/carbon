import Configuration from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Configuration';
import { mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import Summary from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/Summary';

export const mobileAppTabs = [
  {
    label: 'Summary',
    path: `${mobileAppPathFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Configuration',
    path: `${mobileAppPathFullyQualified}/configuration`,
    component: Configuration,
    mobileAppOnly: true
  }
].filter(Boolean);

export const viewTabs = mobileAppTabs.filter(tab => !tab.mobileAppOnly);
