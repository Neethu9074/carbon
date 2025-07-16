/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error Module needs to be translated to TS
import { sapJavaNetWeaverSystemSensorDashboardFullyQualified } from 'in-sap/navigation/paths';
import RelatedResources from 'in-sap/Dashboards/SapJavaNetWeaverSystemSensor/tabs/RelatedResources';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapJavaNetWeaverSystemSensorDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
];
