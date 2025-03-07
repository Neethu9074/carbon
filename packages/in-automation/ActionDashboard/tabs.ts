/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Action } from '@instana/types';

import { actionSummaryFullyQualified, actionConfigurationFullyQualified } from 'in-automation/navigation/paths';
import ActionConfiguration from 'in-automation/ActionDashboard/ActionConfiguration/ActionConfiguration';
import ActionSummary from 'in-automation/ActionDashboard/ActionSummary/ActionSummary';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { t } from 'in-i18n';

const dashboardTabs: Tab<Action, {}>[] = [
  {
    label: t('in-automation:actionDashboard.tabs.summaryLabel'),
    path: actionSummaryFullyQualified,
    component: ActionSummary
  },
  {
    label: t('in-automation:actionDashboard.tabs.configurationLabel'),
    path: actionConfigurationFullyQualified,
    component: ActionConfiguration
  }
];

export default dashboardTabs;
