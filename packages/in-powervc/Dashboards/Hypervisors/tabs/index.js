/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { powervcHypervisorDashboardFullyQualified } from 'in-powervc/navigation/paths';
import Summary from 'in-powervc/Dashboards/Hypervisors/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-powervc:dashboards.summary'),
    path: `${powervcHypervisorDashboardFullyQualified}/summary`,
    component: Summary
  }
];
