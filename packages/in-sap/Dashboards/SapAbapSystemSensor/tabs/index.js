/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapAbapSystemSensor/tabs/RelatedResources';
import { sapAbapSystemSensorDashboardFullyQualified } from 'in-sap/navigation/paths';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapAbapSystemSensorDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
