/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/AbapCentralInstance/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/AbapCentralInstance/tabs/Infrastructure';
import { abapCentralInstanceDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/AbapCentralInstance/tabs/AvailMetrics';
import Summary from 'in-sap/Dashboards/AbapCentralInstance/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${abapCentralInstanceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${abapCentralInstanceDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  // {
  //   label: t('in-sap:dashboards.exceptions'),
  //   path: `${abapInstanceDashboardFullyQualified}/excepMetrics`,
  //   component: ExcepMetrics
  // },
  // {
  //   label: t('in-sap:dashboards.performance'),
  //   path: `${abapInstanceDashboardFullyQualified}/perfMetrics`,
  //   component: PerfMetrics
  // },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${abapCentralInstanceDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${abapCentralInstanceDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
