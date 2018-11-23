import Configuration from 'in-websites/WebsiteDashboard/tabs/Configuration/Configuration';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/WebsiteDashboard/tabs/Summary/Summary';
import Globe from 'in-websites/WebsiteDashboard/tabs/Globe/Globe';
import Pages from 'in-websites/WebsiteDashboard/tabs/Pages';
import Speed from 'in-websites/WebsiteDashboard/tabs/Speed';

export const websiteTabs = [
  {
    label: 'Summary',
    path: `${websitePathFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Speed',
    path: `${websitePathFullyQualified}/speed`,
    component: Speed
  },
  {
    label: 'Geography',
    path: `${websitePathFullyQualified}/globe`,
    component: Globe,
    stickToHeader: true,
    isFullWidth: true
  },
  {
    label: 'Pages',
    path: `${websitePathFullyQualified}/pages`,
    component: Pages,
    websiteOnly: true
  },
  {
    label: 'Configuration',
    path: `${websitePathFullyQualified}/configuration`,
    component: Configuration,
    websiteOnly: true
  }
];

export const pageTabs = websiteTabs.filter(tab => !tab.websiteOnly);
