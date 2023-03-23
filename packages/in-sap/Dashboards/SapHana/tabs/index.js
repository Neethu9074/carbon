/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapHana/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapHana/tabs/Infrastructure';
import { sapHanaDashboardFullyQualified } from 'in-sap/navigation/paths';
import ConfigMetrics from 'in-sap/Dashboards/SapHana/tabs/ConfigMetrics';
import AvailMetrics from 'in-sap/Dashboards/SapHana/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapHana/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapHana/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapHana/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapHanaDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapHanaDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapHanaDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapHanaDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.configurations'),
    path: `${sapHanaDashboardFullyQualified}/configMetrics`,
    component: ConfigMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapHanaDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapHanaDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
