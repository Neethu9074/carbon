/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import Configuration from 'in-websites/WebsiteDashboard/tabs/Configuration/Configuration';
import Geography from 'in-websites/WebsiteDashboard/tabs/Geography/Geography';
import CustomEvents from 'in-websites/WebsiteDashboard/tabs/CustomEvents';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/WebsiteDashboard/tabs/Summary/Summary';
import { websiteUserBreakdownEnabled } from 'in-services/featureFlags';
import Resources from 'in-websites/WebsiteDashboard/tabs/Resources';
import User from 'in-websites/WebsiteDashboard/tabs/User/User';
import Errors from 'in-websites/WebsiteDashboard/tabs/Errors';
import Alerts from 'in-websites/WebsiteDashboard/tabs/Alerts';
import Speed from 'in-websites/WebsiteDashboard/tabs/Speed';
import Pages from 'in-websites/WebsiteDashboard/tabs/Pages';
import Ajax from 'in-websites/WebsiteDashboard/tabs/Ajax';
import { role } from 'in-stores/user';

export const websiteTabs = [
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelSummary'),
    path: `${websitePathFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelSpeed'),
    path: `${websitePathFullyQualified}/speed`,
    component: Speed
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelResources'),
    path: `${websitePathFullyQualified}/resources`,
    component: Resources
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelHTTPRequests'),
    path: `${websitePathFullyQualified}/ajax`,
    component: Ajax
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelJSErrors'),
    path: `${websitePathFullyQualified}/errors`,
    component: Errors
  },
  websiteUserBreakdownEnabled && {
    label: t('in-websites:websiteDashboard.tabs.indexLabelUsers'),
    path: `${websitePathFullyQualified}/users`,
    component: User
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelGeography'),
    path: `${websitePathFullyQualified}/geography`,
    component: Geography,
    stickToHeader: true,
    stickToBottom: true,
    isFullWidth: true,
    websiteOnly: true
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelCustomEvents'),
    path: `${websitePathFullyQualified}/customEvents`,
    component: CustomEvents
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelPages'),
    path: `${websitePathFullyQualified}/pages`,
    component: Pages,
    websiteOnly: true
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelAlerts'),
    path: `${websitePathFullyQualified}/alerts`,
    component: Alerts
  },
  role.canConfigureEumApplications && {
    label: t('in-websites:websiteDashboard.tabs.indexLabelConfiguration'),
    path: `${websitePathFullyQualified}/configuration`,
    component: Configuration,
    websiteOnly: true
  }
].filter(Boolean);

export const pageTabs = websiteTabs.filter(tab => !tab.websiteOnly);
