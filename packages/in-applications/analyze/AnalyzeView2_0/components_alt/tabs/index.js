/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import ServicesAndEndpoints from 'in-applications/analyze/AnalyzeView2_0/components_alt/tabs/ServicesAndEndpoints';
import Summary from 'in-applications/analyze/AnalyzeView2_0/components_alt/tabs/Summary';
import Logs from 'in-applications/analyze/AnalyzeView2_0/components_alt/tabs/Logs';
import { loggingEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-applications:tabs.labelSummary'),
    path: '/analyze/summary',
    component: Summary,
    noTopPadding: true
  },
  {
    label: t('in-applications:tabs.servicesAndEndpoint'),
    path: '/analyze/services',
    component: ServicesAndEndpoints,
    noTopPadding: true
  },
  loggingEnabled && {
    label: t('in-applications:tabs.logs'),
    icon: !role.canViewLogs ? 'lib_actions_lock' : undefined,
    path: '/analyze/logs',
    component: Logs,
    noTopPadding: true
  }
].filter(Boolean);
