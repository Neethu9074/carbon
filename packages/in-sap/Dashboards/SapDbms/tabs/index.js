/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapDbms/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapDbms/tabs/Infrastructure';
import { sapDbmsDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/SapDbms/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapDbms/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapDbms/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapDbms/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapDbmsDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapDbmsDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapDbmsDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapDbmsDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapDbmsDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapDbmsDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
