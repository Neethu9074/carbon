/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapHanaSystem/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapHanaSystem/tabs/Infrastructure';
import SelfMonitoring from 'in-sap/Dashboards/SapHanaSystem/tabs/SelfMonitoring';
import { sapHanaSystemDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/SapHanaSystem/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapHanaSystem/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapHanaSystem/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapHanaSystem/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapHanaSystemDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapHanaSystemDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapHanaSystemDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapHanaSystemDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.selfMonitoring'),
    path: `${sapHanaSystemDashboardFullyQualified}/selfMonitoring`,
    component: SelfMonitoring
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapHanaSystemDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapHanaSystemDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
