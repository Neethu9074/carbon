/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapJavaInstance/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapJavaInstance/tabs/Infrastructure';
import { sapJavaInstanceDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/SapJavaInstance/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapJavaInstance/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapJavaInstance/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapJavaInstance/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapJavaInstanceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapJavaInstanceDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapJavaInstanceDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapJavaInstanceDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapJavaInstanceDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapJavaInstanceDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
