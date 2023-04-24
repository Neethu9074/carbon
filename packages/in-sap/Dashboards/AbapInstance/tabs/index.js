/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/AbapInstance/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/AbapInstance/tabs/Infrastructure';
import { abapInstanceDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/AbapInstance/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/AbapInstance/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/AbapInstance/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/AbapInstance/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${abapInstanceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${abapInstanceDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${abapInstanceDashboardFullyQualified}/perfMetrics`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${abapInstanceDashboardFullyQualified}/excepMetrics`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${abapInstanceDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${abapInstanceDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
