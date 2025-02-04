/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  beeInstanaInfraMetricsEnabled,
  beeinstanaInfraMetricsWithTimeshiftEnabled,
  persistentVolumeSupportEnabled,
  playwithEnabled
} from 'in-services/featureFlags';
import { NodeVolumesTab, NodeConditionsTab, NodePodTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Node/tabs/SummaryWithoutTimeShift';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import PersistentVolumes from 'in-kubernetes/Dashboards/Cluster/tabs/PersistentVolumes';
import Infrastructure from 'in-kubernetes/Dashboards/Node/tabs/Infrastructure';
import { nodeDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Details from 'in-kubernetes/Dashboards/Node/tabs/Details/Details';
import Summary from 'in-kubernetes/Dashboards/Node/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${nodeDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${nodeDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.conditions'),
    path: `${nodeDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: NodeConditionsTab
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${nodeDashboardFullyQualified}/pods`,
    component: Pods,
    header: NodePodTab
  },
  {
    label: t('in-kubernetes:dashboards.infrastructure'),
    path: `${nodeDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  },
  persistentVolumeSupportEnabled &&
    !playwithEnabled && {
      label: t('in-kubernetes:dashboards.persistentVolumes'),
      path: `${nodeDashboardFullyQualified}/persistentvolumes`,
      component: PersistentVolumes,
      header: NodeVolumesTab,
      stickToBottom: true
    }
].filter(Boolean);
