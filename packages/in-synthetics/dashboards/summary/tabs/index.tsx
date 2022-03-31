/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import Summary from 'in-synthetics/dashboards/summary/tabs/summary/Summary';
import { syntheticsSummaryPath } from 'in-synthetics/navigation/paths';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-synthetics:dashboard.summary.summaryTab'),
    path: `${syntheticsSummaryPath}`,
    component: Summary
  }
];
