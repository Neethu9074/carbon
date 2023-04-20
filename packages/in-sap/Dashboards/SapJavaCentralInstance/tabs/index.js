/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import RelatedResources from 'in-sap/Dashboards/SapJavaCentralInstance/tabs/RelatedResources';
import Infrastructure from 'in-sap/Dashboards/SapJavaCentralInstance/tabs/Infrastructure';
import { sapJavaCentralInstanceDashboardFullyQualified } from 'in-sap/navigation/paths';
import AvailMetrics from 'in-sap/Dashboards/SapJavaCentralInstance/tabs/AvailMetrics';
import Summary from 'in-sap/Dashboards/SapJavaCentralInstance/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-sap:dashboards.summary'),
    path: `${sapJavaCentralInstanceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-sap:dashboards.availability'),
    path: `${sapJavaCentralInstanceDashboardFullyQualified}/availMetrics`,
    component: AvailMetrics
  },
  {
    label: t('in-sap:dashboards.infrastructure'),
    path: `${sapJavaCentralInstanceDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  {
    label: t('in-sap:dashboards.relatedResources'),
    path: `${sapJavaCentralInstanceDashboardFullyQualified}/relatedResources`,
    component: RelatedResources
  }
].filter(Boolean);
