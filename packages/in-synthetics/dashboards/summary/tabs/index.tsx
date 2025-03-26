/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import {
  syntheticsSummaryPath,
  syntheticResultsListPath,
  syntheticAlertListPath,
  syntheticConfigurationPath,
  syntheticServiceLevelsPath
} from 'in-synthetics/navigation/paths';
import SloDashboardList from 'in-service-levels/components/Shared/SloDashboardList/SloDashboardList';
import Configuration from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration';
import ResultsList from 'in-synthetics/dashboards/summary/tabs/results/ResultsList';
import Summary from 'in-synthetics/dashboards/summary/tabs/summary/Summary';
import Alerts from 'in-alerting/smart-alerts/synthetics/Alerts';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-synthetics:dashboard.summary.summaryTab'),
    path: `${syntheticsSummaryPath}`,
    component: Summary
  },
  {
    label: t('in-synthetics:dashboard.summary.resultsTab'),
    path: `${syntheticResultsListPath}`,
    component: ResultsList
  },
  {
    label: t('in-synthetics:dashboard.summary.smartAlertsTab'),
    path: `${syntheticAlertListPath}`,
    component: Alerts
  },
  {
    label: t('in-synthetics:dashboard.summary.serviceLevelsTab'),
    path: `${syntheticServiceLevelsPath}`,
    component: SloDashboardList
  },
  role?.canViewSyntheticTests && {
    label: t('in-synthetics:dashboard.summary.configurationTab'),
    path: `${syntheticConfigurationPath}`,
    component: Configuration
  }
].filter(Boolean);
