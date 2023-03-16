/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DeploymentConditionsTab, WorkloadTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { deploymentDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Deployment/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Deployment/tabs/Details';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${deploymentDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${deploymentDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${deploymentDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: t('in-kubernetes:dashboards.conditions'),
    path: `${deploymentDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: DeploymentConditionsTab
  },
  {
    label: t('in-kubernetes:dashboards.k8SServices'),
    path: `${deploymentDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${deploymentDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.pods)
  }
].filter(Boolean);

function getCounterComponent({ deploymentId, tab, timeConfig }, valueExtractor) {
  return (
    <WorkloadTab
      workloadControllerId={deploymentId}
      label={tab.label}
      timeConfig={timeConfig}
      valueExtractor={valueExtractor}
    />
  );
}
