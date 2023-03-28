/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapDbTenant/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapDbTenant/tabs/Infrastructure';
import { sapDbTenantDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/SapDbTenant/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapDbTenant/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapDbTenant/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapDbTenant/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapDbTenantDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapDbTenantDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapDbTenantDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapDbTenantDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapDbTenantDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapDbTenantDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
