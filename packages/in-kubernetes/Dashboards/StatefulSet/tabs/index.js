/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { statefulSetDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import { WorkloadTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/StatefulSet/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/StatefulSet/tabs/Details';
import { t } from 'in-i18n';
import { persistentVolumeSupportEnabled } from 'in-services/featureFlags';
import PersistentVolumes from '../../Cluster/tabs/PersistentVolumes';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${statefulSetDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${statefulSetDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${statefulSetDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: t('in-kubernetes:dashboards.nodes'),
    path: `${statefulSetDashboardFullyQualified}/nodes`,
    component: Nodes,
    header: props => getCounterComponent(props, v => v.nodes)
  },
  {
    label: t('in-kubernetes:dashboards.k8SServices'),
    path: `${statefulSetDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${statefulSetDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.pods)
  },
  persistentVolumeSupportEnabled && {
    label: t('in-kubernetes:dashboards.persistentVolumes'),
    path: `${statefulSetDashboardFullyQualified}/persistentvolumes`,
    component: PersistentVolumes,
    header: props => getCounterComponent(props, v => v.volumes),
    stickToBottom: true
  }
].filter(Boolean);

function getCounterComponent({ workloadControllerId, tab, timeConfig }, valueExtractor) {
  return (
    <WorkloadTab
      workloadControllerId={workloadControllerId}
      label={tab.label}
      timeConfig={timeConfig}
      valueExtractor={valueExtractor}
    />
  );
}
