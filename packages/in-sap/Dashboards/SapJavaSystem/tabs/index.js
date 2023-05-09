/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapJavaSystem/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapJavaSystem/tabs/Infrastructure';
import SelfMonitoring from 'in-sap/Dashboards/SapJavaSystem/tabs/SelfMonitoring';
import { sapJavaSystemDashboardFullyQualified } from 'in-sap/navigation/paths';
import ConfigMetrics from 'in-sap/Dashboards/SapJavaSystem/tabs/ConfigMetrics';
import AvailMetrics from 'in-sap/Dashboards/SapJavaSystem/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapJavaSystem/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapJavaSystem/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapJavaSystem/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapJavaSystemDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapJavaSystemDashboardFullyQualified}/availability`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.configurations'),
    path: `${sapJavaSystemDashboardFullyQualified}/configurations`,
    component: ConfigMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapJavaSystemDashboardFullyQualified}/exceptions`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapJavaSystemDashboardFullyQualified}/performance`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.selfMonitoring'),
    path: `${sapJavaSystemDashboardFullyQualified}/selfMonitoring`,
    component: SelfMonitoring
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapJavaSystemDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapJavaSystemDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
