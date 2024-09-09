/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Deployment/tabs/SummaryWithoutTimeShift';
import { DeploymentConditionsTab, WorkloadTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { deploymentDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Deployment/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Deployment/tabs/Details';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${deploymentDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
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

function getCounterComponent({ result, tab, location }, valueExtractor) {
  const deploymentId = result?.data?.id;
  const timeConfig = getTimeConfig(location);
  return (
    <WorkloadTab
      workloadControllerId={deploymentId}
      label={tab.label}
      timeConfig={timeConfig}
      valueExtractor={valueExtractor}
    />
  );
}
