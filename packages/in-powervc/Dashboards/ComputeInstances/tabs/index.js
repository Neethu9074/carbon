/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { powervcInstanceDashboardFullyQualified } from 'in-powervc/navigation/paths';
import Summary from 'in-powervc/Dashboards/ComputeInstances/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-powervc:dashboards.summary'),
    path: `${powervcInstanceDashboardFullyQualified}/summary`,
    component: Summary
  }
];
