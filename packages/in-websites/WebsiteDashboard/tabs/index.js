import Configuration from 'in-websites/WebsiteDashboard/tabs/Configuration/Configuration';
import Geography from 'in-websites/WebsiteDashboard/tabs/Geography/Geography';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/WebsiteDashboard/tabs/Summary/Summary';
import { websiteUserBreakdownEnabled } from 'in-services/featureFlags';
import Resources from 'in-websites/WebsiteDashboard/tabs/Resources';
import User from 'in-websites/WebsiteDashboard/tabs/User/User';
import Errors from 'in-websites/WebsiteDashboard/tabs/Errors';
import Pages from 'in-websites/WebsiteDashboard/tabs/Pages';
import Speed from 'in-websites/WebsiteDashboard/tabs/Speed';
import Ajax from 'in-websites/WebsiteDashboard/tabs/Ajax';

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
    label: 'Resources',
    path: `${websitePathFullyQualified}/resources`,
    component: Resources
  },
  {
    label: 'HTTP Requests',
    path: `${websitePathFullyQualified}/ajax`,
    component: Ajax
  },
  {
    label: 'JS Errors',
    path: `${websitePathFullyQualified}/errors`,
    component: Errors
  },
  websiteUserBreakdownEnabled && {
    label: 'Users',
    path: `${websitePathFullyQualified}/users`,
    component: User
  },
  {
    label: 'Geography',
    path: `${websitePathFullyQualified}/geography`,
    component: Geography,
    stickToHeader: true,
    stickToBottom: true,
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
].filter(Boolean);

export const pageTabs = websiteTabs.filter(tab => !tab.websiteOnly);
