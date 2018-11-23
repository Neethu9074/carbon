import Configuration from 'in-websites/WebsiteDashboard/tabs/Configuration/Configuration';
import Geography from 'in-websites/WebsiteDashboard/tabs/Geography/Geography';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/WebsiteDashboard/tabs/Summary/Summary';
import Errors from 'in-websites/WebsiteDashboard/tabs/Errors';
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
    label: 'Errors',
    path: `${websitePathFullyQualified}/errors`,
    component: Errors
  },
  {
    label: 'Geography',
    path: `${websitePathFullyQualified}/geography`,
    component: Geography,
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
