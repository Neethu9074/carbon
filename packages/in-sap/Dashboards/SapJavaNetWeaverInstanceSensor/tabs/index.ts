/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error Module needs to be translated to TS
import { sapJavaNetWeaverInstanceSensorDashboardFullyQualified } from 'in-sap/navigation/paths';
import Summary from 'in-sap/Dashboards/SapJavaNetWeaverInstanceSensor/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapJavaNetWeaverInstanceSensorDashboardFullyQualified}/summary`,
    component: Summary
  }
];
