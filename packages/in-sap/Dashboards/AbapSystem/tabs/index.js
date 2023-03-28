/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/AbapSystem/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/AbapSystem/tabs/Infrastructure';
import { abapSystemDashboardFullyQualified } from 'in-sap/navigation/paths';
import ConfigMetrics from 'in-sap/Dashboards/AbapSystem/tabs/ConfigMetrics';
import AvailMetrics from 'in-sap/Dashboards/AbapSystem/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/AbapSystem/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/AbapSystem/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/AbapSystem/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${abapSystemDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${abapSystemDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.configurations'),
    path: `${abapSystemDashboardFullyQualified}/configMetrics`,
    component: ConfigMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${abapSystemDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${abapSystemDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${abapSystemDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${abapSystemDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
