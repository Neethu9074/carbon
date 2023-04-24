/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapDbInstance/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapDbInstance/tabs/Infrastructure';
import { sapDbInstanceDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/SapDbInstance/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapDbInstance/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapDbInstance/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapDbInstance/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapDbInstanceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapDbInstanceDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapDbInstanceDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapDbInstanceDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapDbInstanceDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapDbInstanceDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
