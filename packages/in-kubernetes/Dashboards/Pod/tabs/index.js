/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  beeInstanaInfraMetricsEnabled,
  beeinstanaInfraMetricsWithTimeshiftEnabled,
  persistentVolumeSupportEnabled,
  kubernetesPrometheusMetricsEnabled
} from 'in-services/featureFlags';
import PersistentVolumeClaims from 'in-kubernetes/Dashboards/commonComponents/pvc/PersistentVolumeClaims';
import PrometheusMetrics from 'in-kubernetes/Dashboards/Pod/tabs/Prometheus/PrometheusMetrics';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import { PodConditionsTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import Infrastructure from 'in-kubernetes/Dashboards/Pod/tabs/Infrastructure';
import { podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Pod/tabs/Summary/Summary';
import Details from 'in-kubernetes/Dashboards/Pod/tabs/Details/Details';
import SummaryWithoutTimeShift from './Summary/SummaryWithoutTimeShift';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${podDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${podDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.conditions'),
    path: `${podDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: PodConditionsTab
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${podDashboardFullyQualified}/events`,
    component: Events
  },
  {
    label: t('in-kubernetes:dashboards.containers'),
    path: `${podDashboardFullyQualified}/containers`,
    component: Infrastructure
  },
  persistentVolumeSupportEnabled && {
    label: t('in-kubernetes:dashboards.persistentVolumeClaims'),
    path: `${podDashboardFullyQualified}/persistentvolumeclaims`,
    component: PersistentVolumeClaims,
    stickToBottom: true
  },
  kubernetesPrometheusMetricsEnabled && {
    label: t('in-kubernetes:dashboards.prometheusMetrics'),
    path: `${podDashboardFullyQualified}/prometheus`,
    component: PrometheusMetrics
  }
].filter(Boolean);
