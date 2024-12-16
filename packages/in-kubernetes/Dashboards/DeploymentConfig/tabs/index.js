/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DeploymentConfigConditionsTab, WorkloadTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import { deploymentConfigDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/Details';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${deploymentConfigDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${deploymentConfigDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${deploymentConfigDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: t('in-kubernetes:dashboards.conditions'),
    path: `${deploymentConfigDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: DeploymentConfigConditionsTab
  },
  {
    label: t('in-kubernetes:dashboards.k8SServices'),
    path: `${deploymentConfigDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${deploymentConfigDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.pods)
  }
].filter(Boolean);

function getCounterComponent({ result, tab, location }, valueExtractor) {
  const deploymentConfigId = result?.data?.id;
  const timeConfig = getTimeConfig(location);
  return (
    <WorkloadTab
      workloadControllerId={deploymentConfigId}
      label={tab.label}
      timeConfig={timeConfig}
      valueExtractor={valueExtractor}
    />
  );
}
