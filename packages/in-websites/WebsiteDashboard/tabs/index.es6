import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/WebsiteDashboard/tabs/Summary/Summary';
import Globe from 'in-websites/WebsiteDashboard/tabs/Globe/Globe';

export default [
  {
    label: 'Summary',
    path: `${websitePathFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Globe',
    path: `${websitePathFullyQualified}/globe`,
    component: Globe,
    stickToHeader: true,
    isFullWidth: true
  }
];
