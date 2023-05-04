/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapWebDispatcher/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapWebDispatcher/tabs/Infrastructure';
import { sapWebDispatcherDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/SapWebDispatcher/tabs/AvailMetrics';
import ExcepMetrics from 'in-sap/Dashboards/SapWebDispatcher/tabs/ExcepMetrics';
import PerfMetrics from 'in-sap/Dashboards/SapWebDispatcher/tabs/PerfMetrics';
import Summary from 'in-sap/Dashboards/SapWebDispatcher/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapWebDispatcherDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapWebDispatcherDashboardFullyQualified}/availability`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.exceptions'),
    path: `${sapWebDispatcherDashboardFullyQualified}/exceptions`,
    component: ExcepMetrics
  },
  {
    label: t('in-sap:dashboards.performance'),
    path: `${sapWebDispatcherDashboardFullyQualified}/performance`,
    component: PerfMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapWebDispatcherDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapWebDispatcherDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
