/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import {
  playwithEnabled,
  syntheticRbacLimitedEnabled,
  websiteUserBreakdownEnabled,
  websitesBusinessMonitoringEnabled
} from 'in-services/featureFlags';
import SyntheticMonitoring from 'in-websites/WebsiteDashboard/tabs/SyntheticMonitoring/SyntheticMonitoring';
import BusinessMonitoring from 'in-websites/WebsiteDashboard/tabs/BusinessMonitoring/BusinessMonitoring';
import SloDashboardList from 'in-service-levels/components/Shared/SloDashboardList/SloDashboardList';
import Configuration from 'in-websites/WebsiteDashboard/tabs/Configuration/Configuration';
import Geography from 'in-websites/WebsiteDashboard/tabs/Geography/Geography';
import CustomEvents from 'in-websites/WebsiteDashboard/tabs/CustomEvents';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/WebsiteDashboard/tabs/Summary/Summary';
import Resources from 'in-websites/WebsiteDashboard/tabs/Resources';
import User from 'in-websites/WebsiteDashboard/tabs/User/User';
import Errors from 'in-websites/WebsiteDashboard/tabs/Errors';
import Alerts from 'in-websites/WebsiteDashboard/tabs/Alerts';
import Speed from 'in-websites/WebsiteDashboard/tabs/Speed';
import Pages from 'in-websites/WebsiteDashboard/tabs/Pages';
import Ajax from 'in-websites/WebsiteDashboard/tabs/Ajax';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

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
  syntheticRbacLimitedEnabled && {
    label: t('in-websites:websiteDashboard.tabs.synthetic.tabLabel'),
    path: `${websitePathFullyQualified}/synthetics`,
    component: SyntheticMonitoring,
    websiteOnly: true
  },
  websitesBusinessMonitoringEnabled && {
    label: t('in-websites:websiteDashboard.tabs.indexLabelBusinessMonitoring'),
    path: `${websitePathFullyQualified}/businessMonitoring`,
    component: BusinessMonitoring,
    websiteOnly: true
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelAlerts'),
    path: `${websitePathFullyQualified}/alerts`,
    component: Alerts
  },
  {
    label: t('in-websites:websiteDashboard.tabs.indexLabelServiceLevels'),
    path: `${websitePathFullyQualified}/slo`,
    component: SloDashboardList,
    websiteOnly: true
  },
  role.canConfigureEumApplications &&
    !playwithEnabled && {
      label: t('in-websites:websiteDashboard.tabs.indexLabelConfiguration'),
      path: `${websitePathFullyQualified}/configuration`,
      component: Configuration,
      websiteOnly: true
    }
].filter(Boolean);

export const pageTabs = websiteTabs.filter(tab => !tab.websiteOnly);
