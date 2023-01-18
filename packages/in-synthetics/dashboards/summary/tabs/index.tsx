/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import {
  syntheticsSummaryPath,
  syntheticAlertListPath,
  syntheticResultsListPath
} from 'in-synthetics/navigation/paths';
import ResultsList from 'in-synthetics/dashboards/summary/tabs/results/ResultsList';
import Summary from 'in-synthetics/dashboards/summary/tabs/summary/Summary';
import Alerts from 'in-alerting/smart-alerts/synthetics/Alerts';
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
  }
].filter(Boolean);
